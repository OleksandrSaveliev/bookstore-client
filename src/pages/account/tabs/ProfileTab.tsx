import React from "react";
import { Button } from "../../../components/ui/Button/Button";
import { Input } from "../../../components/ui/Input/Input";
import styles from "../Account.module.css";

interface ProfileTabProps {
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  userData: any;
  formData: { name: string; email: string };
  setFormData: (data: any) => void;
  handleUpdateProfile: (e: React.FormEvent) => void;
  loading: boolean;
  userId?: number;
}

export const ProfileTab = ({
  isEditing,
  setIsEditing,
  userData,
  formData,
  setFormData,
  handleUpdateProfile,
  loading,
  userId,
}: ProfileTabProps) => (
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
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <div className={styles.formActions}>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsEditing(false)}
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
          <p>{userData?.name || "N/A"}</p>
        </div>
        <div className={styles.infoGroup}>
          <label>Email Address</label>
          <p>{userData?.email || "N/A"}</p>
        </div>
        <div className={styles.infoGroup}>
          <label>Account ID</label>
          <p className={styles.idText}>#{userId}</p>
        </div>
      </div>
    )}
  </div>
);
