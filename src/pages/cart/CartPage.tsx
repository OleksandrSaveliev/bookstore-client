import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { orderService } from "../../api/order.service";
import { Button } from "../../components/ui/Button/Button";
import styles from "./Cart.module.css";
import axios from "axios";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCheckout = async () => {
    // 1. Pre-validation
    if (!user?.id) {
      setError("Please log in to complete your purchase.");
      return;
    }
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      /**
       * MATCHES OrderRequestDTO.java:
       * The backend expects a field named "items", NOT "bookItems".
       */
      const orderRequest = {
        items: cart.map((item) => ({
          bookId: Number(item.id),
          quantity: Number(item.quantity),
          price: Number(item.price.toFixed(2)),
        })),
      };

      await orderService.createOrder(orderRequest);

      // Success Path
      clearCart();
      navigate("/account", { state: { activeTab: "orders", success: true } });
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        // Parse Spring Boot Validation Errors (e.g., err.response.data.items)
        const backendData = err.response?.data;
        const errorMessage =
          backendData?.items || // Specific @NotEmpty message
          backendData?.message ||
          "Checkout failed. Ensure you have enough funds.";

        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Checkout Failed:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyContent}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2>Your cart is empty</h2>
          <p>Find your next great read in our collection.</p>
          <Button
            to="/books"
            variant="primary"
          >
            Browse Books
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Shopping Cart</h1>

      <div className={styles.layout}>
        <div className={styles.itemList}>
          {cart.map((item) => (
            <div
              key={item.id}
              className={styles.cartItem}
            >
              <div className={styles.itemMain}>
                <div className={styles.itemInfo}>
                  <h3>{item.name}</h3>
                  <p className={styles.authorText}>{item.author}</p>
                </div>
                <div className={styles.priceTag}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>

              <div className={styles.itemActions}>
                <div className={styles.quantityControls}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className={styles.summaryCard}>
          <h2>Order Summary</h2>

          {error && (
            <div className={styles.errorBanner}>
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className={styles.summaryDetails}>
            <div className={styles.summaryLine}>
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className={styles.summaryLine}>
              <span>Shipping</span>
              <span className={styles.freeText}>FREE</span>
            </div>
          </div>

          <div className={styles.totalLine}>
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <Button
            variant="primary"
            onClick={handleCheckout}
            disabled={loading}
            className={styles.checkoutBtn}
          >
            {loading ? "Processing..." : "Confirm Purchase"}
          </Button>

          <p className={styles.secureNote}>
            🔒 Payment will be deducted from your wallet balance.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
