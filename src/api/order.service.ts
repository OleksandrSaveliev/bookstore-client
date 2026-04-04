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
};
