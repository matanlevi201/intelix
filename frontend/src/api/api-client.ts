import { useSessionStore } from "@/context/use-session-store";
import { refreshToken, signout } from "./auth.api";
import axios from "axios";

const BASE_URL = "http://localhost:1000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const { accessToken } = useSessionStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { setSession, endSession } = useSessionStore.getState();
    const originalRequest = error.config;

    switch (true) {
      case originalRequest.url.includes("/session") && originalRequest.method === "get":
        return Promise.reject(error);
      case error.response?.status === 401 && !originalRequest._retry: {
        originalRequest._retry = true;
        try {
          const result = await refreshToken();
          if (result.success) {
            setSession(result.data.accessToken);
            return api(originalRequest);
          }
        } catch {}
        signout();
        endSession();
        return Promise.reject(error);
      }
      default:
        return Promise.reject(error);
    }
  }
);

export default api;
