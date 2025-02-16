import { TFAToken, Generate2faQrResponse, Enable2faResponse, Verify2faResponse, Disable2faResponse } from "@intelix/common";
import { makeRequest } from "@/api/make-request";
import { HttpMethod } from "@/types";

const BASE_URL = "/2fa";

export const generate2faQr = async () => {
  return await makeRequest<never, Generate2faQrResponse>({
    method: HttpMethod.GET,
    url: BASE_URL,
  });
};

export const enable2fa = async (token: string) => {
  return await makeRequest<TFAToken, Enable2faResponse>({
    method: HttpMethod.POST,
    url: BASE_URL,
    body: { token },
  });
};

export const verify2fa = async (token: string) => {
  return await makeRequest<TFAToken, Verify2faResponse>({
    method: HttpMethod.POST,
    url: `${BASE_URL}/verify`,
    body: { token },
  });
};

export const disable2fa = async (token: string) => {
  return await makeRequest<TFAToken, Disable2faResponse>({
    method: HttpMethod.DELETE,
    url: BASE_URL,
    body: { token },
  });
};
