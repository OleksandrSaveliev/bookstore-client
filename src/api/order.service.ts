import type { OrderResponseDTO } from "../types/orders";
import api from "./axios";

export const orderService = {
  getByClientId: async (clientId: number) => {
    const response = await api.get(`/orders/client/${clientId}`);
    return response.data;
  },

  createOrder: async (orderData: any) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  getAllOrders: async (
    page = 0,
    size = 10,
    search = "",
    sortBy = "orderDate",
    direction = "desc",
  ): Promise<{ content: OrderResponseDTO[]; totalPages: number }> => {
    const response = await api.get("/orders", {
      params: {
        page,
        size,
        search: search || undefined,
        sortBy,
        direction,
      },
    });
    return response.data;
  },

  updateOrderStatus: async (id: number, status: string): Promise<void> => {
    await api.patch(`/orders/${id}/status?status=${status}`);
  },
};
