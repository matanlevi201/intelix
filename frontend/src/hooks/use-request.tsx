import { ErrorResponse, RequestResponse } from "@/types/api";
import { useState } from "react";

type useRequestProps<T> = {
  requestFn: () => Promise<RequestResponse<T>>;
  onSuccess: (data: T) => Promise<void>;
};

export function useRequest<T>({ requestFn, onSuccess }: useRequestProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [errors, setErrors] = useState<ErrorResponse>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const executeRequest = async () => {
    setLoading(true);
    setErrors([]);

    const response = await requestFn();
    if (response.success) {
      setData(response.data);
      await onSuccess(response.data);
    } else {
      setErrors(response.errors);
    }
    setLoading(false);
  };

  return { data, errors, loading, executeRequest };
}
