import type { BookDTO } from "../types/book";
import api from "./axios";

export const bookService = {
  getAll: async (page = 0, size = 8) => {
    const response = await api.get(`/books?page=${page}&size=${size}`, {
      withCredentials: true,
    });
    return response.data;
  },

  getById: async (id: number): Promise<BookDTO> => {
    const response = await api.get<BookDTO>(`/books/${id}`);
    return response.data;
  },

  // EMPLOYEE only
  create: async (book: BookDTO): Promise<BookDTO> => {
    const response = await api.post<BookDTO>("/books", book);
    return response.data;
  },

  // EMPLOYEE only
  update: async (name: number, book: Partial<BookDTO>): Promise<BookDTO> => {
    const response = await api.put<BookDTO>(`/books/${name}`, book);
    return response.data;
  },

  // EMPLOYEE only
  remove: async (name: string): Promise<void> => {
    await api.delete(`/books/${name}`);
  },
};
