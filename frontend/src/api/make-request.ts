import { ErrorResponse, RequestProps, RequestResponse } from "@/types";
import api from "./api-client";
import axios from "axios";

export const makeRequest = async <T, K>({ method, url, body }: RequestProps<T>): Promise<RequestResponse<K>> => {
  try {
    const response = await api({ method, url, data: body });
    return { success: true, data: response.data as K };
  } catch (error) {
    const errors: ErrorResponse = [];
    if (axios.isAxiosError(error) && error.response?.data) {
      const { errors: axiosErrors } = error.response.data as { errors: ErrorResponse };
      errors.push(...axiosErrors);
      return { success: false, errors };
    }
    const unexpectedError = (error as Error)?.message ?? "An unknown error occurred";
    errors.push({ message: unexpectedError });
    return { success: false, errors };
  }
};
