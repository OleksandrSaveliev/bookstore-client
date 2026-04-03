import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { CartItem } from "../types/cart";
import type { BookDTO } from "../types/book";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (book: BookDTO) => void;
  removeFromCart: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  // 1. Initialize state from LocalStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
      return [];
    }
  });

  // 2. Memoized clear function to prevent unnecessary re-renders
  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem("cart");
  }, []);

  // 3. Effect: Sync State to LocalStorage
  // This only runs when the 'cart' array actually changes.
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  useEffect(() => {
    if (!user && cart.length > 0) {
      clearCart();
    }
  }, [user, cart.length, clearCart]);

  const addToCart = (book: BookDTO) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === book.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  const updateQuantity = (bookId: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === bookId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    );
  };

  const removeFromCart = (bookId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== bookId));
  };

  // 5. Derived State (Calculated on the fly)
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
