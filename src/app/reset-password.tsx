import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { commonStyles } from "../utils/commonStyles";
import CustomButton from "../components/button";
import { HelperText, TextInput, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { useResetPasswordMutation } from "@/state/services/auth";
import { handleApiError } from "../utils/handleApiError";
import { useSnackbar } from "../providers/SnackbarProvider/SnackbarProvider";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { clearToken } from "@/state/slices/auth";

const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Current Password is required"),
  newPassword: yup
    .string()
    .min(8, "New Password must be at least 8 characters")
    .notOneOf(
      [yup.ref("password")],
      "New password must be different from the current password"
    )
    .required("New Password is required"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm New Password is required"),
});

const ResetPassword = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const [
    resetPassword,
    { data: resetPasswordData, isLoading, isError, error },
  ] = useResetPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigation = useNavigation();

  const resetStackAndNavigate = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "login" }],
      })
    );
  };

  useEffect(() => {
    if (resetPasswordData) {
      console.log(resetPasswordData);
      showSnackbar(resetPasswordData?.message, "success");
      dispatch(clearToken());
      resetStackAndNavigate();
    }
  }, [resetPasswordData]);

  useEffect(() => {
    if (isError && error) {
      const errorMessage = handleApiError(error);
      console.log("Error occurred:", errorMessage);
      showSnackbar(errorMessage, "error");
    }
  }, [isError, error]);

  const onSubmit = async (data: any) => {
    console.log(data);
    await resetPassword({
      currentPassword: data?.password,
      newPassword: data?.newPassword,
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
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Enter your current password"
            secureTextEntry
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            mode="outlined"
            style={commonStyles.topMargin}
            error={Boolean(errors.password)}
            editable={!isLoading}
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.password)}>
        {errors.password?.message}
      </HelperText>

      <Controller
        control={control}
        name="newPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Enter new password"
            secureTextEntry
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            mode="outlined"
            error={Boolean(errors.newPassword)}
            editable={!isLoading}
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.newPassword)}>
        {errors.newPassword?.message}
      </HelperText>

      <Controller
        control={control}
        name="confirmNewPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Confirm new password"
            secureTextEntry
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            mode="outlined"
            error={Boolean(errors.confirmNewPassword)}
            editable={!isLoading}
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.confirmNewPassword)}>
        {errors.confirmNewPassword?.message}
      </HelperText>

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

export default ResetPassword;

const styles = StyleSheet.create({
  bottomButtonContainer: {
    position: "absolute",
    width: "100%",
    alignSelf: "center",
  },
});
