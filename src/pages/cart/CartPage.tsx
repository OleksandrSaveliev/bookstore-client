import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { orderService } from "../../api/order.service";
import { Button } from "../../components/ui/Button/Button";
import { toast } from "react-toastify";
import styles from "./Cart.module.css";
import axios from "axios";
import { useTranslation } from "react-i18next"; // Added

const CartPage = () => {
  const { t } = useTranslation(); // Added
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    if (!user?.id) {
      setError(t("cart.errors.authRequired"));
      toast.warn(t("cart.toasts.authRequired"));
      return;
    }
    if (cart.length === 0) {
      setError(t("cart.errors.empty"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderRequest = {
        items: cart.map((item) => ({
          bookId: Number(item.id),
          quantity: Number(item.quantity),
          price: Number(item.price.toFixed(2)),
        })),
      };

      await orderService.createOrder(orderRequest);

      toast.success(t("cart.toasts.orderSuccess"));
      clearCart();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const backendData = err.response?.data;

        const errorMessage =
          backendData?.message ||
          (typeof backendData === "object"
            ? Object.values(backendData)[0]
            : null) ||
          t("cart.errors.checkoutFailed");

        setError(errorMessage as string);
      } else {
        setError(t("cart.errors.unexpected"));
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyContent}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2>{t("cart.empty.title")}</h2>
          <p>{t("cart.empty.subtitle")}</p>
          <Button
            to="/books"
            variant="primary"
          >
            {t("cart.empty.browseBtn")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("cart.title")}</h1>

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
                  {t("cart.item.remove")}
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className={styles.summaryCard}>
          <h2>{t("cart.summary.title")}</h2>

          {error && (
            <div className={styles.errorBanner}>
              <strong>{t("cart.summary.notice")}:</strong> {error}
            </div>
          )}

          <div className={styles.summaryDetails}>
            <div className={styles.summaryLine}>
              <span>{t("cart.summary.subtotal")}</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className={styles.summaryLine}>
              <span>{t("cart.summary.shipping")}</span>
              <span className={styles.freeText}>{t("cart.summary.free")}</span>
            </div>
          </div>

          <div className={styles.totalLine}>
            <span>{t("cart.summary.total")}</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <Button
            variant="primary"
            onClick={handleCheckout}
            disabled={loading}
            className={styles.checkoutBtn}
          >
            {loading
              ? t("cart.summary.processing")
              : t("cart.summary.confirmBtn")}
          </Button>

          <p className={styles.secureNote}>{t("cart.summary.secureNote")}</p>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
