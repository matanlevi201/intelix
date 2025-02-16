import { Method } from "axios";

export type RequestProps<TBody> = {
  url: string;
  method: Method;
  body?: TBody;
};

export type RequestResponse<T> = { success: true; data: T } | { success: false; errors: ErrorResponse };

export type ErrorResponse = { message: string }[];

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}
