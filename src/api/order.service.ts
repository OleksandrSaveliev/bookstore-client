import type { OrderResponseDTO } from "../types/orders";
import api from "./axios";

export const orderService = {
  getByClientId: async (clientId: number) => {
    const response = await api.get(`/orders/client/${clientId}`);
    return response.data;
  },

  getClientOrders: async () => {
    const response = await api.get(`/orders/my`);
    return response.data;
  },

  createOrder: async (orderData: any) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  getAllOrders: async (
    page: number,
    size: number,
    sortBy: string,
    direction: string,
    search?: string,
  ) => {
    const response = await api.get("/orders", {
      params: {
        page: page,
        size: size,
        sortBy: sortBy,
        direction: direction,
        search: search || "",
      },
    });
    return response.data;
  },

  updateOrderStatus: async (id: number, status: string): Promise<void> => {
    await api.patch(`/orders/${id}/status?status=${status}`);
  },
};
