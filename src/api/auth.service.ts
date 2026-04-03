import type { AuthResponse } from "../types/auth";
import api from "./axios";

export const authService = {
  signin: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/signin", credentials);
    return response.data;
  },

  signup: async (userData: any): Promise<AuthResponse> => {
    // This uses the SignupRequestDTO on the backend
    const response = await api.post<AuthResponse>("/auth/signup", userData);
    return response.data;
  },

  signout: async (): Promise<void> => {
    await api.post("/auth/signout");
  },
};
