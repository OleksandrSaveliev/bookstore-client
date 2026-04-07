import { useEffect, useState, useCallback } from "react";
import { orderService } from "../../api/order.service";
import { toast } from "react-toastify";
import Pagination from "../../components/ui/Pagination/Pagination";
import styles from "./AdminDashboard.module.css";
import type { OrderResponseDTO } from "../../types/orders";
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchId, setSearchId] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders(
        page,
        10,
        sortBy,
        sortDir,
        activeSearch,
      );

      setOrders(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      toast.error(t("admin.orders.toast.loadError"));
    } finally {
      setLoading(false);
    }
  }, [page, activeSearch, sortBy, sortDir, t]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
    setPage(0);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setActiveSearch(searchId);
  };

  // Logic to handle clicking a User ID in the table
  const handleUserClick = (clientId: number) => {
    const idString = clientId.toString();
    setSearchId(idString);
    setActiveSearch(idString);
    setPage(0); // Reset to first page for the specific user search
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      toast.success(t("admin.orders.toast.updateSuccess", { id }));
      loadOrders();
    } catch (err) {
      toast.error(t("admin.orders.toast.updateError"));
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return <span className={styles.sortIdle}>↕</span>;
    return sortDir === "desc" ? " ▼" : " ▲";
  };

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1>{t("admin.orders.title")}</h1>
          <button
            className={`${styles.refreshBtn} ${loading ? styles.spinning : ""}`}
            onClick={loadOrders}
            disabled={loading}
          >
            ↻
          </button>
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
              <th>ID</th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort("createdAt")}
              >
                {t("admin.orders.table.date")} {renderSortIcon("createdAt")}
              </th>
              <th>{t("admin.orders.table.client")}</th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort("price")}
              >
                {t("admin.orders.table.total")} {renderSortIcon("price")}
              </th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort("status")}
              >
                {t("admin.orders.table.status")} {renderSortIcon("status")}
              </th>
              <th>{t("admin.orders.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              orders.map((order) => (
                <tr
                  key={order.id}
                  className={styles.tableRow}
                >
                  <td>#{order.id}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleString(i18n.language)}
                  </td>
                  <td>
                    {/* Clickable User ID */}
                    <button
                      className={styles.clientLink}
                      onClick={() => handleUserClick(order.clientId)}
                      title={t("admin.orders.clickToFilter")}
                    >
                      {t("admin.orders.userLabel", { id: order.clientId })}
                    </button>
                  </td>
                  <td className={styles.amount}>${order.price?.toFixed(2)}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className={styles.actionsCell}>
                    {order.status === "PENDING" && (
                      <div className={styles.btnGroup}>
                        <button
                          className={styles.approveBtn}
                          onClick={() =>
                            handleStatusUpdate(order.id, "COMPLETED")
                          }
                        >
                          ✓
                        </button>
                        <button
                          className={styles.cancelBtn}
                          onClick={() =>
                            handleStatusUpdate(order.id, "CANCELLED")
                          }
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loading && <div className={styles.loader}>{t("common.loading")}</div>}
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
