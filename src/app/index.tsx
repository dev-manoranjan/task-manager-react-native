import { View } from "react-native";
import { commonStyles } from "../utils/commonStyles";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { router } from "expo-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

export default function Index() {
  const { token } = useSelector((state: RootState) => state.auth);
  const theme = useTheme();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (token) {
        router.replace("/task-manager");
        return;
      }
      router.replace("/sign-up");
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View
      style={[
        commonStyles.flex1,
        commonStyles.justifyCenter,
        commonStyles.alignCenter,
      ]}
    >
      <ActivityIndicator
        animating={true}
        size={"large"}
        color={theme.colors.primary}
      />
    </View>
  );
}
