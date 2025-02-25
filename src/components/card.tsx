import React from "react";
import { GestureResponderEvent } from "react-native";
import { Card, IconButton, useTheme } from "react-native-paper";

interface CustomCardProps {
  id: string;
  title: string;
  description?: string;
  onRightIconPressed: (
    event: GestureResponderEvent,
    item: {
      id: string;
      title: string;
      description?: string;
    }
  ) => void;
  onPressed: (item: {
    id: string;
    title: string;
    description?: string;
  }) => void;
}

const CustomCard: React.FC<CustomCardProps> = ({
  id,
  title,
  description,
  onRightIconPressed,
  onPressed,
}) => {
  const theme = useTheme();

  return (
    <Card
      onPress={() => {
        onPressed({ id, title, description });
      }}
    >
      <Card.Title
        title={title}
        subtitle={description}
        right={() => (
          <IconButton
            icon="dots-vertical"
            iconColor={theme.colors.primary}
            size={20}
            onPress={(event) =>
              onRightIconPressed(event, { id, title, description })
            }
          />
        )}
      />
    </Card>
  );
};

export default CustomCard;
