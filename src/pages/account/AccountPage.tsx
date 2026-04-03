import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { clientService } from "../../api/client.service";
import { Button } from "../../components/ui/Button/Button";
import { Input } from "../../components/ui/Input/Input";
import styles from "./Account.module.css";

const AccountPage = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "wallet" | "orders">(
    "profile",
  );
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Wallet state
  const [topUpAmount, setTopUpAmount] = useState<string>("");

  // Profile form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  // Sync form data if user object changes (e.g., after a refresh)
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setLoading(true);
    setMessage("");

    try {
      const updated = await clientService.update(user.id, {
        ...user,
        name: formData.name,
        email: formData.email,
      });
      refreshUser(updated);
      setMessage("Profile updated successfully! ✨");
      setIsEditing(false);
    } catch (err) {
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(topUpAmount);
    if (!user?.id || isNaN(amount) || amount <= 0) return;

    setLoading(true);
    setMessage("");

    try {
      const updated = await clientService.update(user.id, {
        ...user,
        balance: (user.balance || 0) + amount,
      });
      refreshUser(updated);
      setMessage(`Successfully added $${amount.toFixed(2)} to your wallet! 💰`);
      setTopUpAmount("");
    } catch (err) {
      setMessage("Failed to add funds.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Account</h1>

      <div className={styles.tabs}>
        {["profile", "wallet", "orders"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? styles.activeTab : ""}
            onClick={() => {
              setActiveTab(tab as any);
              setMessage("");
              setIsEditing(false);
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.card}>
        {message && <div className={styles.alert}>{message}</div>}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className={styles.profileContainer}>
            <div className={styles.headerRow}>
              <h3>Personal Information</h3>
              {!isEditing && (
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>

            {isEditing ? (
              <form
                onSubmit={handleUpdateProfile}
                className={styles.form}
              >
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                />
                <div className={styles.formActions}>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || "",
                        email: user?.email || "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className={styles.infoGrid}>
                <div className={styles.infoGroup}>
                  <label>Full Name</label>
                  <p>{user?.name || "N/A"}</p>
                </div>
                <div className={styles.infoGroup}>
                  <label>Email Address</label>
                  <p>{user?.email || "N/A"}</p>
                </div>
                <div className={styles.infoGroup}>
                  <label>Account ID</label>
                  <p className={styles.idText}>#{user?.id}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* WALLET TAB */}
        {activeTab === "wallet" && (
          <div className={styles.walletSection}>
            <div className={styles.balanceCard}>
              <div className={styles.balanceInfo}>
                <span className={styles.balanceLabel}>Current Balance</span>
                <h2 className={styles.balanceAmount}>
                  ${user?.balance?.toFixed(2) || "0.00"}
                </h2>
              </div>
              <div className={styles.walletIcon}>💳</div>
            </div>

            <form
              onSubmit={handleAddFunds}
              className={styles.topUpForm}
            >
              <Input
                label="Add Funds to Wallet"
                type="number"
                step="0.01"
                min="1"
                placeholder="0.00"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !topUpAmount}
              >
                {loading ? "Processing..." : "Add Money"}
              </Button>
            </form>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className={styles.ordersPlaceholder}>
            <div className={styles.emptyIcon}>📦</div>
            <p>You haven't placed any orders yet.</p>
            <Button
              to="/books"
              variant="ghost"
            >
              Browse Bookstore
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
