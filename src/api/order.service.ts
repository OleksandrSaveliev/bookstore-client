import api from "./axios";

export interface OrderItemRequest {
  bookId: number;
  quantity: number;
}

export interface OrderRequest {
  items: OrderItemRequest[];
}

export const orderService = {
  createOrder: async (items: OrderItemRequest[]) => {
    const response = await api.post("/orders", { items });
    return response.data;
  },
};
