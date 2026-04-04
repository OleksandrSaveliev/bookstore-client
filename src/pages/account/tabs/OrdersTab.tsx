import React from "react";
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
  orderDate: string; // LocalDateTime comes as string in JSON
  price: number;
  bookItems: BookItemDTO[];
}

export const OrdersTab = ({
  orders,
  loading,
}: {
  orders: OrderResponseDTO[];
  loading: boolean;
}) => (
  <div className={styles.ordersSection}>
    <div className={styles.headerRow}>
      <h3>Order History</h3>
    </div>

    {loading ? (
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
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
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
                  {/* Since Status isn't in your DTO yet, we'll hardcode "COMPLETED" or "PENDING" */}
                  <span className={styles.statusBadge}>COMPLETED</span>
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
