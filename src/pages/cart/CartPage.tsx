import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { orderService } from "../../api/order.service";
import { Button } from "../../components/ui/Button/Button";
import styles from "./Cart.module.css";
import axios from "axios";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const orderItems = cart.map((item) => ({
        bookId: item.id,
        quantity: item.quantity,
      }));

      await orderService.createOrder(orderItems);

      clearCart();
      navigate("/orders", { state: { success: true } });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ||
          "Checkout failed. Please check your balance or stock.";
        setError(message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyContent}>
          <span style={{ fontSize: "48px" }}>🛒</span>
          <h2>Your cart is empty</h2>
          <p>Explore our collection and find your next favorite book.</p>
          <Button
            to="/"
            variant="primary"
          >
            Browse Books
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} fade-in`}>
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
                  <p>{item.author}</p>
                </div>
                <div className={styles.priceTag}>${item.price.toFixed(2)}</div>
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
          <h2>Summary</h2>
          {error && <div className={styles.errorBanner}>{error}</div>}

          <div className={styles.summaryLine}>
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className={styles.summaryLine}>
            <span>Shipping</span>
            <span className={styles.freeText}>Free</span>
          </div>

          <div className={styles.totalLine}>
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <Button
            variant="primary"
            onClick={handleCheckout}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "24px",
              padding: "16px",
              fontSize: "16px",
            }}
          >
            {loading ? "Processing..." : "Confirm Purchase"}
          </Button>

          <p className={styles.secureNote}>
            🔒 Secure checkout powered by BookStore
          </p>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
