import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { clientService } from "../../api/client.service";
import { orderService } from "../../api/order.service";
import { ProfileTab } from "./tabs/ProfileTab";
import { WalletTab } from "./tabs/WalletTab";
import { OrdersTab } from "./tabs/OrdersTab";
import styles from "./Account.module.css";
import { useTranslation } from "react-i18next"; // Added

const AccountPage = () => {
  const { t } = useTranslation(); // Added
  const { user, userData, setUserData } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "wallet" | "orders">(
    "profile",
  );
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "" });

  const fetchFreshData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await clientService.getById(user.id);
      setUserData(data);
      setFormData({ name: data.name, email: data.email });
    } catch (err) {
      setStatus({ type: "error", text: t("account.status.syncFailed") }); // Translated
    }
  }, [user?.id, setUserData, t]);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    setOrdersLoading(true);
    try {
      const data = await orderService.getClientOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) fetchFreshData();
  }, [user?.id, fetchFreshData]);

  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
  }, [activeTab, fetchOrders]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setLoading(true);
    setStatus(null);
    try {
      await clientService.update(user.id, formData);
      await fetchFreshData();
      setStatus({ type: "success", text: t("account.status.profileUpdated") }); // Translated
      setIsEditing(false);
    } catch (err: any) {
      setStatus({
        type: "error",
        text: err.response?.data?.message || t("account.status.updateError"), // Translated
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) return;

    setLoading(true);
    setStatus(null);
    try {
      await clientService.update(user.id, {
        balance: (userData?.balance || 0) + amount,
      });
      await fetchFreshData();
      setStatus({ type: "success", text: t("account.status.fundsAdded") }); // Translated
      setTopUpAmount("");
    } catch (err: any) {
      setStatus({ type: "error", text: t("account.status.txFailed") }); // Translated
    } finally {
      setLoading(false);
    }
  };

  if (!userData)
    return (
      <div className={styles.loadingContainer}>{t("account.loading")}</div>
    ); // Translated

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("account.title")}</h1>
      <div className={styles.tabs}>
        {(["profile", "wallet", "orders"] as const).map((tKey) => (
          <button
            key={tKey}
            className={activeTab === tKey ? styles.activeTab : ""}
            onClick={() => {
              setActiveTab(tKey);
              setStatus(null);
              setIsEditing(false);
            }}
          >
            {t(`account.tabs.${tKey}`)} {/* Dynamic tab translation */}
          </button>
        ))}
      </div>

      <div className={styles.card}>
        {status && (
          <div
            className={`${styles.alert} ${status.type === "error" ? styles.errorAlert : styles.successAlert}`}
          >
            {status.text}
          </div>
        )}

        {activeTab === "profile" && (
          <ProfileTab
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            userData={userData}
            formData={formData}
            setFormData={setFormData}
            handleUpdateProfile={handleUpdateProfile}
            loading={loading}
            userId={user?.id}
          />
        )}

        {activeTab === "wallet" && (
          <WalletTab
            balance={userData.balance || 0}
            topUpAmount={topUpAmount}
            setTopUpAmount={setTopUpAmount}
            handleAddFunds={handleAddFunds}
            loading={loading}
          />
        )}

        {activeTab === "orders" && (
          <OrdersTab
            orders={orders}
            loading={ordersLoading}
            onRefresh={fetchOrders}
          />
        )}
      </div>
    </div>
  );
};

export default AccountPage;
