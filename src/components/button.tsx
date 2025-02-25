import React from "react";
import { Button } from "react-native-paper";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  isLoading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  icon,
  isLoading,
}) => {
  return (
    <Button icon={icon} mode="contained" onPress={onPress} loading={isLoading}>
      {title}
    </Button>
  );
};

export default CustomButton;
