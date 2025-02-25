import { createApi } from "@reduxjs/toolkit/query/react";
import { LOGIN, RESET_PASSWORD, SIGNUP } from "@/src/constants/endpoints";
import { baseQuery } from "@/src/utils/rtk-query-setup";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  token: string;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

export type SignupResponse = {
  message: string;
};

export type ResetPasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type ResetPasswordResponse = {
  message: string;
};

export const authService = createApi({
  reducerPath: "authService",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    signup: builder.mutation<SignupResponse, SignupPayload>({
      query: (body) => ({
        url: SIGNUP,
        method: "POST",
        body: body,
      }),
    }),
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: LOGIN,
        method: "POST",
        body: body,
      }),
    }),
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordPayload
    >({
      query: (body) => ({
        url: RESET_PASSWORD,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSignupMutation, useLoginMutation, useResetPasswordMutation } =
  authService;
