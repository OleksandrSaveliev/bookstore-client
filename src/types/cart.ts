import type { BookDTO } from "./book";

export interface CartItem extends BookDTO {
  quantity: number;
}
