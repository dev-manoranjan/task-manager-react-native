import React, { createContext, useContext, useState } from "react";
import { Portal, Snackbar, useTheme } from "react-native-paper";

type SnackbarType = "success" | "error" | "info";

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    type?: SnackbarType,
    duration?: number
  ) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<SnackbarType>("info");
  const [duration, setDuration] = useState(3000);

  const theme = useTheme();

  const showSnackbar = (
    msg: string,
    type: SnackbarType = "info",
    durationMs = 3000
  ) => {
    setMessage(msg);
    setSnackbarType(type);
    setDuration(durationMs);
    setVisible(true);
  };

  const getBackgroundColor = () => {
    switch (snackbarType) {
      case "success":
        return theme.colors.primary;
      case "error":
        return theme.colors.error;
      case "info":
      default:
        return theme.colors.secondary;
    }
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Portal>
        <Snackbar
          visible={visible}
          onDismiss={() => setVisible(false)}
          duration={duration}
          style={{ backgroundColor: getBackgroundColor() }}
        >
          {message}
        </Snackbar>
      </Portal>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
