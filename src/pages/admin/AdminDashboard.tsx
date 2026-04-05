import { useEffect, useState } from "react";
import { orderService } from "../../api/order.service";
import { toast } from "react-toastify";
import Pagination from "../../components/ui/Pagination/Pagination";
import styles from "./AdminDashboard.module.css";
import type { OrderResponseDTO } from "../../types/orders";
import { useTranslation } from "react-i18next"; // Added

const AdminDashboard = () => {
  const { t, i18n } = useTranslation(); // Added
  const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchId, setSearchId] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders(
        page,
        10,
        activeSearch,
        "createdAt",
        sortDir,
      );
      setOrders(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      toast.error(t("admin.orders.toast.loadError")); // Translated
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, activeSearch, sortDir]);

  const toggleSort = () => {
    setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(0);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setActiveSearch(searchId);
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      toast.success(t("admin.orders.toast.updateSuccess", { id })); // Interpolated
      await loadOrders();
    } catch (err) {
      toast.error(t("admin.orders.toast.updateError")); // Translated
    }
  };

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.titleRow}>
            <h1>{t("admin.orders.title")}</h1>
            <button
              className={`${styles.refreshBtn} ${loading ? styles.spinning : ""}`}
              onClick={loadOrders}
              title={t("admin.orders.refreshTitle")}
              disabled={loading}
            >
              ↻
            </button>
          </div>
        </div>
        <form
          className={styles.searchBar}
          onSubmit={handleSearch}
        >
          <input
            type="number"
            placeholder={t("admin.orders.searchPlaceholder")}
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button
            type="submit"
            className={styles.searchBtn}
          >
            {t("admin.orders.filterBtn")}
          </button>
          {activeSearch && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => {
                setSearchId("");
                setActiveSearch("");
              }}
            >
              {t("admin.orders.resetBtn")}
            </button>
          )}
        </form>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t("admin.orders.table.id")}</th>
              <th
                onClick={toggleSort}
                className={styles.sortableHeader}
              >
                {t("admin.orders.table.date")} {sortDir === "desc" ? "▼" : "▲"}
              </th>
              <th>{t("admin.orders.table.client")}</th>
              <th>{t("admin.orders.table.total")}</th>
              <th>{t("admin.orders.table.status")}</th>
              <th className={styles.actionsHeader}>
                {t("admin.orders.table.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              orders.map((order) => (
                <tr
                  key={order.id}
                  className={styles.tableRow}
                >
                  <td className={styles.orderId}>#{order.id}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleString(i18n.language)}
                  </td>
                  <td>
                    <button
                      className={styles.clientLink}
                      onClick={() => {
                        setSearchId(order.clientId.toString());
                        setActiveSearch(order.clientId.toString());
                      }}
                    >
                      {t("admin.orders.userLabel", { id: order.clientId })}
                    </button>
                  </td>
                  <td className={styles.amount}>${order.price?.toFixed(2)}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}
                    >
                      {t(`account.orders.status.${order.status.toLowerCase()}`)}
                    </span>
                  </td>
                  <td className={styles.actionsCell}>
                    {order.status === "PENDING" ? (
                      <div className={styles.btnGroup}>
                        <button
                          className={styles.approveBtn}
                          onClick={() =>
                            handleStatusUpdate(order.id, "COMPLETED")
                          }
                          title={t("admin.orders.actions.approve")}
                        >
                          ✓
                        </button>
                        <button
                          className={styles.cancelBtn}
                          onClick={() =>
                            handleStatusUpdate(order.id, "CANCELLED")
                          }
                          title={t("admin.orders.actions.cancel")}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span className={styles.finalized}>
                        {t("admin.orders.done")}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default AdminDashboard;
