import React, { useEffect, useLayoutEffect } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import {
  HelperText,
  IconButton,
  TextInput,
  useTheme,
} from "react-native-paper";
import { commonStyles } from "../utils/commonStyles";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import CustomButton from "../components/button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useLazyGetSpecificTaskQuery,
  useUpdateTaskMutation,
} from "@/state/services/tasks";
import Loading from "../components/loading";
import { useSnackbar } from "../providers/SnackbarProvider/SnackbarProvider";
import { handleApiError } from "../utils/handleApiError";

const schema = yup.object().shape({
  title: yup.string().required("Email is required"),
  description: yup.string().required("Password is required"),
});

const AddTask = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const navigation = useNavigation();
  const { showSnackbar } = useSnackbar();
  const { id = "" } = useLocalSearchParams<{
    id?: string;
  }>();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [getSpecificTask, { data: taskData, isFetching }] =
    useLazyGetSpecificTaskQuery();

  const [updateTask, { data: updateTaskData, isLoading, isError, error }] =
    useUpdateTaskMutation();

  const [
    createTask,
    {
      data: createTaskData,
      isLoading: createTaskLoading,
      isError: createTaskIsError,
      error: createTaskError,
    },
  ] = useCreateTaskMutation();

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
          if (id) {
            deleteTask(id);
          }
        },
      },
    ]);

  useLayoutEffect(() => {
    if (id) {
      navigation.setOptions({
        headerRight: () => (
          <IconButton
            icon="delete"
            iconColor={theme.colors.error}
            onPress={showAlert}
          />
        ),
      });
    }
  }, [navigation, id]);

  // get specific task handlers
  useEffect(() => {
    if (id) {
      console.log("ID:", id);
      getSpecificTask(id);
    }
  }, [id]);

  useEffect(() => {
    if (taskData) {
      console.log("Task Data:", taskData);
      setValue("title", taskData.title);
      setValue("description", taskData.description);
    }
  }, [taskData]);

  // update task handlers
  useEffect(() => {
    if (updateTaskData) {
      console.log("Update Task Data:", updateTaskData);
      showSnackbar("Task updated successfully!", "success");
      router.dismiss();
    }
  }, [updateTaskData]);

  useEffect(() => {
    if (isError && error) {
      const errorMessage = handleApiError(error);
      console.log("Error occurred:", errorMessage);
      showSnackbar(errorMessage, "error");
    }
  }, [isError, error]);

  // create task handlers
  useEffect(() => {
    if (createTaskData) {
      console.log(createTaskData);
      showSnackbar("Task created successfully!", "success");
      router.dismiss();
    }
  }, [createTaskData]);

  useEffect(() => {
    if (createTaskIsError && createTaskError) {
      const errorMessage = handleApiError(createTaskError);
      console.log("Error occurred:", errorMessage);
      showSnackbar(errorMessage, "error");
    }
  }, [createTaskIsError, createTaskError]);

  // delete task handlers
  useEffect(() => {
    if (deleteTaskData) {
      console.log("Delete Task Data:", deleteTaskData);
      showSnackbar("Task deleted successfully!", "success");
      router.dismiss();
    }
  }, [deleteTaskData]);

  useEffect(() => {
    if (deleteTaskIsError && deleteTaskError) {
      const errorMessage = handleApiError(deleteTaskError);
      console.log("Error occurred:", errorMessage);
      showSnackbar(errorMessage, "error");
    }
  }, [deleteTaskIsError, deleteTaskError]);

  const onSubmit = (data: any) => {
    console.log(data);
    if (id) {
      updateTask({
        id,
        title: data?.title,
        description: data?.description,
      });
      return;
    }
    createTask({
      title: data?.title,
      description: data?.description,
    });
  };

  if (isFetching || isLoading || createTaskLoading || deleteTaskLoading) {
    return <Loading />;
  }

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
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Title"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            mode="outlined"
            error={Boolean(errors.title)}
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.title)}>
        {errors.title?.message}
      </HelperText>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Description"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            mode="outlined"
            error={Boolean(errors.description)}
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.description)}>
        {errors.description?.message}
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
          icon="check"
          title="Done"
          onPress={() => {
            handleSubmit(onSubmit)();
          }}
        />
      </View>
    </View>
  );
};

export default AddTask;

const styles = StyleSheet.create({
  bottomButtonContainer: {
    position: "absolute",
    width: "100%",
    alignSelf: "center",
  },
});
