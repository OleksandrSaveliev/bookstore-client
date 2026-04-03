import axios from "axios";
import type { ClientDTO } from "../types/client";

const API_URL = "/api/v1/clients";

export const clientService = {
  getById: async (id: number) => {
    const response = await axios.get<ClientDTO>(`${API_URL}/${id}`);
    return response.data;
  },

  update: async (id: number, data: ClientDTO) => {
    const response = await axios.put<ClientDTO>(`${API_URL}/${id}`, data);
    return response.data;
  },
};
