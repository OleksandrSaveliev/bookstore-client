import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { toast } from "react-toastify";

interface BackendError {
  status: number;
  message: string;
  timestamp: string;
  errors?: Record<string, string>;
}

const api = axios.create({
  baseURL: "http://localhost:8084/api/v1",
  withCredentials: true,
});

interface FailedRequest {
  resolve: (value?: any) => void;
  reject: (error: any) => void;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const { response, config } = error;
    const originalRequest = config as CustomAxiosRequestConfig;

    if (!response) {
      toast.error("Unable to connect to the server.");
      return Promise.reject(error);
    }

    const status = response.status;
    const data = response.data as BackendError;
    const currentPath = window.location.pathname;

    const isAuthPage =
      currentPath.includes("/login") || currentPath.includes("/oauth-callback");

    if (status === 401 && !originalRequest._retry) {
      if (isAuthPage) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("user");
        if (!isAuthPage) {
          window.location.href = "/login?expired=true";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    switch (status) {
      case 400:
        if (!data.errors) {
          toast.error(data.message || "Invalid Request");
        }
        break;

      case 404:
        toast.error(data.message || "Resource not found");
        break;

      case 409:
        toast.error(data.message || "Conflict occurred.");
        break;

      case 403:
        toast.error(data.message || "Access denied");
        break;

      case 500:
        toast.error("Server error. Please try again later.");
        break;

      default:
        if (status !== 401) {
          toast.error(data.message || "An unexpected error occurred.");
        }
    }

    return Promise.reject(error);
  },
);

export default api;
