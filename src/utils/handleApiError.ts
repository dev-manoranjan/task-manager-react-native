import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface CustomError {
  message: string;
}

export const handleApiError = (error: unknown): string => {
  if (!error) return "An unknown error occurred";

  if ("status" in (error as FetchBaseQueryError)) {
    // API error (FetchBaseQueryError)
    const apiError = error as FetchBaseQueryError;
    if (
      apiError.data &&
      typeof apiError.data === "object" &&
      "message" in apiError.data
    ) {
      return (apiError.data as CustomError).message;
    }
  } else if ("message" in (error as Error)) {
    // Internal error (SerializedError)
    return (error as Error).message;
  }

  return "An unexpected error occurred";
};
