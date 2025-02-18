import { SignBody, SignResponse } from "@intelix/common";
import { makeRequest } from "@/api/make-request";
import { EHttpMethods } from "@/shared/enums";

const BASE_URL = "/auth";

export const signup = async ({ email, password }: SignBody) => {
  return await makeRequest<SignBody, SignResponse>({
    method: EHttpMethods.POST,
    url: `${BASE_URL}/users`,
    body: { email, password },
  });
};

export const signin = async ({ email, password }: SignBody) => {
  return await makeRequest<SignBody, SignResponse>({
    method: EHttpMethods.POST,
    url: `${BASE_URL}/sessions`,
    body: { email, password },
  });
};

export const signout = async () => {
  return await makeRequest<SignBody, null>({
    method: EHttpMethods.DELETE,
    url: `${BASE_URL}/sessions`,
  });
};

export const refreshToken = async () => {
  return await makeRequest<never, SignResponse>({
    method: EHttpMethods.GET,
    url: `${BASE_URL}/sessions`,
  });
};
