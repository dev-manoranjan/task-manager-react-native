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
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/state/services/auth";
import { setToken } from "@/state/slices/auth";
import { handleApiError } from "../utils/handleApiError";
import { useSnackbar } from "../providers/SnackbarProvider/SnackbarProvider";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const Login = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const [login, { data: loginData, isLoading, isError, error }] =
    useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (loginData) {
      console.log(loginData);
      dispatch(setToken(loginData?.token));
      showSnackbar("Logged in successful!", "success");
      router.replace("/task-manager");
    }
  }, [loginData]);

  useEffect(() => {
    if (isError && error) {
      const errorMessage = handleApiError(error);
      console.log("Error occurred:", errorMessage);
      showSnackbar(errorMessage, "error");
    }
  }, [isError, error]);

  const onSubmit = async (data: any) => {
    console.log(data);
    await login({
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
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Enter your email"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            mode="outlined"
            style={commonStyles.topMargin}
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

      <View style={styles.dontHaveAccount}>
        <Text variant="bodyMedium">Don't have account?</Text>
        <Button
          mode="text"
          onPress={() => {
            router.replace("/sign-up");
          }}
        >
          Create Account
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

export default Login;

const styles = StyleSheet.create({
  bottomButtonContainer: {
    position: "absolute",
    width: "100%",
    alignSelf: "center",
  },
  dontHaveAccount: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ...commonStyles.topMargin,
  },
});
