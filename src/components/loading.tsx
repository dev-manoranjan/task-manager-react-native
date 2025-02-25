import React from "react";
import { View } from "react-native";
import { commonStyles } from "../utils/commonStyles";
import { ActivityIndicator, useTheme } from "react-native-paper";

const Loading = () => {
  const theme = useTheme();
  return (
    <View
      style={[
        commonStyles.flex1,
        commonStyles.justifyCenter,
        commonStyles.alignCenter,
      ]}
    >
      <ActivityIndicator animating size="large" color={theme.colors.primary} />
    </View>
  );
};

export default Loading;
