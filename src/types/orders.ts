export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface OrderItemDTO {
  id: number;
  bookId: number;
  bookName: string;
  author: string;
  quantity: number;
  price: number;
}

export interface OrderResponseDTO {
  id: number;
  clientId: number;
  createdAt: string;
  price: number;
  status: OrderStatus;
  bookItems: OrderItemDTO[];
}
