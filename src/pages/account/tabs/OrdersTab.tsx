import { Button } from "../../../components/ui/Button/Button";
import styles from "../Account.module.css";
import { useTranslation } from "react-i18next"; // Added

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
}) => {
  const { t, i18n } = useTranslation(); // Added

  return (
    <div className={styles.ordersSection}>
      <div className={styles.headerRow}>
        <div className={styles.titleWithRefresh}>
          <h3>{t("account.orders.title")}</h3>
          <button
            className={`${styles.refreshBtn} ${loading ? styles.spinning : ""}`}
            onClick={onRefresh}
            disabled={loading}
            title={t("account.orders.refresh")}
          >
            ↻
          </button>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className={styles.loadingPlaceholder}>
          {t("account.orders.loading")}
        </div>
      ) : orders.length > 0 ? (
        <div className={styles.ordersTableWrapper}>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>{t("account.orders.table.id")}</th>
                <th>{t("account.orders.table.date")}</th>
                <th>{t("account.orders.table.items")}</th>
                <th>{t("account.orders.table.total")}</th>
                <th>{t("account.orders.table.status")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className={styles.idText}>#{order.id}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleString(i18n.language)}
                  </td>
                  <td>
                    <span className={styles.itemCount}>
                      {order.bookItems?.reduce(
                        (acc, item) => acc + item.quantity,
                        0,
                      ) || 0}{" "}
                      {t("account.orders.books")}
                    </span>
                  </td>
                  <td className={styles.priceText}>
                    ${order.price?.toFixed(2)}
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}
                    >
                      {/* Translate the status string dynamically */}
                      {t(`account.orders.status.${order.status.toLowerCase()}`)}
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
          <p>{t("account.orders.empty")}</p>
          <Button
            to="/books"
            variant="ghost"
          >
            {t("account.orders.startShopping")}
          </Button>
        </div>
      )}
    </div>
  );
};
