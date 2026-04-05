import axios from "axios";
import { toast } from "react-toastify"; // Optional: Great for quick UI feedback

const api = axios.create({
  baseURL: "http://localhost:8084/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response) {
      const status = response.status;
      const data = response.data;

      switch (status) {
        case 401:
          console.warn("Session expired. Redirecting...");
          localStorage.clear();
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login?expired=true";
          }
          break;

        case 400:
          if (data && !data.status) {
            console.error("Validation Errors:", data);
          } else {
            toast.error(data.message || "Invalid Request");
          }
          break;

        case 404:
          toast.error(data.message || "Resource not found");
          break;

        case 409:
          toast.error(data.message || "This already exists");
          break;

        case 500:
          toast.error("Server error. Please try again later.");
          break;

        default:
          toast.error("An unexpected error occurred.");
      }
    } else {
      toast.error("Unable to connect to the server.");
    }

    return Promise.reject(error);
  },
);

export default api;
