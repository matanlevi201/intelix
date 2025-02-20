import { makeRequest } from "@/api/make-request";
import { EHttpMethods } from "@/shared/enums";
import { Model } from "@intelix/common";

const BASE_URL = "/models";

export const getModels = async () => {
  return await makeRequest<never, Model[]>({
    method: EHttpMethods.GET,
    url: BASE_URL,
  });
};
