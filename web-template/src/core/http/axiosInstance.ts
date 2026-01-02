import axios from "axios";
import { authToken } from "@/core/auth/authToken";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}`,
  timeout: Number(import.meta.env.VITE_TIMEOUT) || 10000,
  withCredentials: true, // ✅ 讓 cookie 帶上（refresh token 用）
});

instance.interceptors.request.use((config) => {
  const token = authToken.get();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        // 🔐 手動推斷型別，避免 AxiosResponse import 問題
        refreshPromise = (async () => {
          try {
            const res = await instance.post("/auth/refresh", null, {
              withCredentials: true,
            });

            const token = (res.data as { token: string }).token;
            authToken.set(token);
          } catch {
            authToken.remove();
            window.location.href = "/login";
          } finally {
            isRefreshing = false;
            refreshPromise = null;
          }
        })();
      }

      await refreshPromise;

      const newToken = authToken.get();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest); // 🔁 Retry 原請求
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
