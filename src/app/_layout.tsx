import { Stack, router } from "expo-router";
import { Alert, useColorScheme } from "react-native";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/state/store";
import {
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import merge from "deepmerge";

import { Colors } from "../constants/colors";
import { clearToken } from "@/state/slices/auth";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { SnackbarProvider } from "../providers/SnackbarProvider/SnackbarProvider";

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: { ...MD3DarkTheme.colors, ...Colors.dark },
};
const customLightTheme = {
  ...MD3LightTheme,
  colors: { ...MD3LightTheme.colors, ...Colors.light },
};

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedLightTheme = merge(LightTheme, customLightTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const paperTheme =
    colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme;

  const showAlert = (dispatch: Dispatch<UnknownAction>) =>
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => {
          dispatch(clearToken());
          router.replace("/login");
        },
      },
    ]);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={paperTheme}>
          <ThemeProvider value={paperTheme as unknown as Theme}>
            <SnackbarProvider>
              <Stack>
                <Stack.Screen
                  name="index"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="sign-up"
                  options={{
                    title: "Welcome",
                  }}
                />
                <Stack.Screen
                  name="task-manager"
                  options={{
                    title: "Task Manager",
                    headerRight: () => {
                      const dispatch = useDispatch();
                      return (
                        <IconButton
                          icon="logout-variant"
                          iconColor={paperTheme.colors.tertiary}
                          size={20}
                          onPress={() => showAlert(dispatch)}
                        />
                      );
                    },
                    headerLeft: () => {
                      return (
                        <IconButton
                          icon="account"
                          iconColor={paperTheme.colors.primary}
                          size={20}
                          onPress={() => {
                            router.push("/reset-password");
                          }}
                        />
                      );
                    },
                  }}
                />
                <Stack.Screen
                  name="add-task"
                  options={{
                    title: "Add Task",
                  }}
                />
                <Stack.Screen
                  name="login"
                  options={{
                    title: "Welcome Back",
                  }}
                />
                <Stack.Screen
                  name="reset-password"
                  options={{
                    title: "Reset Password",
                  }}
                />
              </Stack>
            </SnackbarProvider>
          </ThemeProvider>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
