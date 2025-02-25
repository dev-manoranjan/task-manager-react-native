import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { commonStyles } from "../utils/commonStyles";
import CustomButton from "../components/button";
import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSignupMutation } from "@/state/services/auth";
import { useSnackbar } from "../providers/SnackbarProvider/SnackbarProvider";
import { handleApiError } from "../utils/handleApiError";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const SignUp = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();
  const [signup, { data: signupData, isLoading, isError, error }] =
    useSignupMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (signupData) {
      console.log(signupData);
      showSnackbar("Account created successfully! You can login now.", "info");
    }
  }, [signupData]);

  useEffect(() => {
    if (isError && error) {
      const errorMessage = handleApiError(error);
      console.log("Error occurred:", errorMessage);
      showSnackbar(errorMessage, "error");
    }
  }, [isError, error]);

  const onSubmit = async (data: any) => {
    console.log(data);
    await signup({
      name: data?.name?.trim(),
      email: data?.email?.trim()?.toLowerCase(),
      password: data?.password,
    });
  };

  return (
    <View
      style={[
        commonStyles.flex1,
        commonStyles.paddingH16,
        commonStyles.topPadding,
      ]}
    >
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Enter your name"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            mode="outlined"
            error={Boolean(errors.name)}
            editable={!isLoading}
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.name)}>
        {errors.name?.message}
      </HelperText>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Enter your email"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            mode="outlined"
            keyboardType="email-address"
            error={Boolean(errors.email)}
            editable={!isLoading}
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.email)}>
        {errors.email?.message}
      </HelperText>

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Enter your password"
            secureTextEntry
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            mode="outlined"
            error={Boolean(errors.password)}
            editable={!isLoading}
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.password)}>
        {errors.password?.message}
      </HelperText>

      <View style={styles.alreadyHaveAccount}>
        <Text variant="bodyMedium">Already have an account?</Text>
        <Button
          mode="text"
          onPress={() => {
            router.replace("/login");
          }}
        >
          Login
        </Button>
      </View>
      <View
        style={[
          styles.bottomButtonContainer,
          {
            bottom: Platform.OS === "ios" ? insets.bottom : 8,
            backgroundColor: theme.colors.elevation.level0,
          },
        ]}
      >
        <CustomButton
          title="Continue"
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  bottomButtonContainer: {
    position: "absolute",
    width: "100%",
    alignSelf: "center",
  },
  alreadyHaveAccount: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ...commonStyles.topMargin,
  },
  errorText: {
    color: "red",
    marginTop: 4,
  },
});
