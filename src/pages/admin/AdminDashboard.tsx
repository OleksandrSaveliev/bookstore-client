import { useEffect, useState } from "react";
import { orderService } from "../../api/order.service";
import { toast } from "react-toastify";
import Pagination from "../../components/ui/Pagination/Pagination";
import styles from "./AdminDashboard.module.css";
import type { OrderResponseDTO } from "../../types/orders";

const AdminDashboard = () => {
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
      toast.error("Failed to load orders.");
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
      toast.success(`Order #${id} updated`);
      await loadOrders();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.titleRow}>
            <h1>Orders Management</h1>
            <button
              className={`${styles.refreshBtn} ${loading ? styles.spinning : ""}`}
              onClick={loadOrders}
              title="Refresh Orders"
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
            placeholder="User ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button
            type="submit"
            className={styles.searchBtn}
          >
            Filter
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
              Reset
            </button>
          )}
        </form>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th
                onClick={toggleSort}
                className={styles.sortableHeader}
              >
                Created At {sortDir === "desc" ? "▼" : "▲"}
              </th>
              <th>Client ID</th>
              <th>Total</th>
              <th>Status</th>
              <th className={styles.actionsHeader}>Actions</th>
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
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className={styles.clientLink}
                      onClick={() => {
                        setSearchId(order.clientId.toString());
                        setActiveSearch(order.clientId.toString());
                      }}
                    >
                      User #{order.clientId}
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
                    {order.status === "PENDING" ? (
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
                    ) : (
                      <span className={styles.finalized}>Done</span>
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
