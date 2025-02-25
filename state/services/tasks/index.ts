import { createApi } from "@reduxjs/toolkit/query/react";
import { TASKS } from "@/src/constants/endpoints";
import { baseQuery } from "@/src/utils/rtk-query-setup";

export type UpdateTaskPayload = {
  id: string;
  title: string;
  description: string;
};

export type UpdateTaskResponse = {
  message: string;
};

export type CreateTaskPayload = {
  title: string;
  description: string;
};

export type CreateTaskResponse = {
  message: string;
};

export type Task = { id: string; title: string; description: string };

export const taskService = createApi({
  reducerPath: "taskService",
  baseQuery: baseQuery,
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    createTask: builder.mutation<CreateTaskResponse, CreateTaskPayload>({
      query: (body) => ({
        url: TASKS,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation<UpdateTaskResponse, UpdateTaskPayload>({
      query: ({ id, description, title }) => ({
        url: `${TASKS}/${id}`,
        method: "PUT",
        body: { description, title },
      }),
      invalidatesTags: ["Task"],
    }),
    getTasks: builder.query<Task[], void>({
      query: () => ({
        url: `${TASKS}`,
        method: "GET",
      }),
      providesTags: ["Task"],
    }),
    getSpecificTask: builder.query<Task, string>({
      query: (id) => ({
        url: `${TASKS}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Task", id }],
    }),
    deleteTask: builder.mutation<UpdateTaskResponse, string>({
      query: (id) => ({
        url: `${TASKS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useGetTasksQuery,
  useGetSpecificTaskQuery,
  useLazyGetSpecificTaskQuery,
  useDeleteTaskMutation,
} = taskService;
