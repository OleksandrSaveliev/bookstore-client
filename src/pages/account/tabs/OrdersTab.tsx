import { Button } from "../../../components/ui/Button/Button";
import styles from "../Account.module.css";

interface BookItemDTO {
  bookId: number;
  title: string;
  quantity: number;
  price: number;
}

interface OrderResponseDTO {
  id: number;
  clientId: number;
  createdAt: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  price: number;
  bookItems: BookItemDTO[];
}

export const OrdersTab = ({
  orders,
  loading,
  onRefresh,
}: {
  orders: OrderResponseDTO[];
  loading: boolean;
  onRefresh: () => void;
}) => (
  <div className={styles.ordersSection}>
    <div className={styles.headerRow}>
      <div className={styles.titleWithRefresh}>
        <h3>Order History</h3>
        <button
          className={`${styles.refreshBtn} ${loading ? styles.spinning : ""}`}
          onClick={onRefresh}
          disabled={loading}
          title="Refresh orders"
        >
          ↻
        </button>
      </div>
    </div>

    {loading && orders.length === 0 ? (
      <div className={styles.loadingPlaceholder}>Loading your orders...</div>
    ) : orders.length > 0 ? (
      <div className={styles.ordersTableWrapper}>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className={styles.idText}>#{order.id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={styles.itemCount}>
                    {order.bookItems?.reduce(
                      (acc, item) => acc + item.quantity,
                      0,
                    ) || 0}{" "}
                    books
                  </span>
                </td>
                <td className={styles.priceText}>${order.price?.toFixed(2)}</td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className={styles.ordersPlaceholder}>
        <div className={styles.emptyIcon}>📦</div>
        <p>No orders found in your history.</p>
        <Button
          to="/books"
          variant="ghost"
        >
          Start Shopping
        </Button>
      </div>
    )}
  </div>
);
