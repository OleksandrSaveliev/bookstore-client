import type { FullUser } from "../context/AuthContext";
import api from "./axios";

export const clientService = {
  getById: async (id: number) => {
    console.log(`Fetching user details for ID: ${id}`);
    const response = await api.get<FullUser>(`/clients/${id}`);
    return response.data;
  },

  // Changed to PATCH to support partial updates (name, balance, etc.)
  update: async (id: number, data: Partial<FullUser>) => {
    const response = await api.patch<FullUser>(`/clients/${id}`, data);
    return response.data;
  },
};
