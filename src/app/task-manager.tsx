import { SetStateAction, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  GestureResponderEvent,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import CustomButton from "../components/button";
import CustomCard from "../components/card";
import { commonStyles } from "../utils/commonStyles";
import { Menu, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  useDeleteTaskMutation,
  useGetTasksQuery,
} from "@/state/services/tasks";
import Loading from "../components/loading";
import { handleApiError } from "../utils/handleApiError";
import { useSnackbar } from "../providers/SnackbarProvider/SnackbarProvider";

export default function TaskManager() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();
  const [visible, setVisible] = useState<boolean>(false);
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    title?: string;
    description?: string;
  } | null>(null);

  const { data: tasks, isLoading } = useGetTasksQuery();

  const [
    deleteTask,
    {
      data: deleteTaskData,
      isLoading: deleteTaskLoading,
      isError: deleteTaskIsError,
      error: deleteTaskError,
    },
  ] = useDeleteTaskMutation();

  const showAlert = () =>
    Alert.alert("Delete", "Are you sure you want to delete the task?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          if (selectedItem) {
            deleteTask(selectedItem.id);
          }
        },
      },
    ]);

  const openMenu = (
    event: GestureResponderEvent,
    item: { id: string; title: string; description?: string } | null
  ) => {
    setAnchor({
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    });
    setVisible(true);
    setSelectedItem(item);
  };

  const editTask = (
    item: { id: string; title?: string; description?: string } | null
  ) => {
    router.push({
      pathname: "/add-task",
      params: {
        id: item?.id,
      },
    });
  };

  // delete task handlers
  useEffect(() => {
    if (deleteTaskData) {
      console.log("Delete Task Data:", deleteTaskData);
      showSnackbar("Task deleted successfully!", "success");
    }
  }, [deleteTaskData]);

  useEffect(() => {
    if (deleteTaskIsError && deleteTaskError) {
      const errorMessage = handleApiError(deleteTaskError);
      console.log("Error occurred:", errorMessage);
      showSnackbar(errorMessage, "error");
    }
  }, [deleteTaskIsError, deleteTaskError]);

  if (isLoading || deleteTaskLoading) {
    return <Loading />;
  }

  return (
    <View style={commonStyles.flex1}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={commonStyles.bottomPadding}>
            <CustomCard
              id={item.id.toString()}
              title={item.title}
              description={item.description}
              onRightIconPressed={openMenu}
              onPressed={editTask}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.secondary }}
            >{`No tasks available!`}</Text>
          </View>
        )}
        contentContainerStyle={[
          styles.contentContainerStyle,
          { paddingBottom: insets.bottom + 50 },
        ]}
      />
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
          icon="plus"
          title="Add Task"
          onPress={() => {
            router.push("/add-task");
          }}
        />
      </View>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={anchor}
      >
        <Menu.Item
          onPress={() => {
            setVisible(false);
            editTask(selectedItem);
          }}
          title="Edit"
          leadingIcon={"pencil"}
        />
        <Menu.Item
          onPress={() => {
            setVisible(false);
            showAlert();
          }}
          title="Delete"
          leadingIcon={"delete"}
        />
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    ...commonStyles.topPadding,
    ...commonStyles.paddingH16,
  },
  bottomButtonContainer: {
    ...commonStyles.paddingH16,
    position: "absolute",
    width: "100%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
