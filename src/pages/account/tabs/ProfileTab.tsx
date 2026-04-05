import React from "react";
import { Button } from "../../../components/ui/Button/Button";
import { Input } from "../../../components/ui/Input/Input";
import styles from "../Account.module.css";
import { useTranslation } from "react-i18next";

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
}: ProfileTabProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.profileContainer}>
      <div className={styles.headerRow}>
        <h3>{t("account.profile.title")}</h3>
        {!isEditing && (
          <Button
            variant="ghost"
            onClick={() => setIsEditing(true)}
          >
            {t("account.profile.editBtn")}
          </Button>
        )}
      </div>

      {isEditing ? (
        <form
          onSubmit={handleUpdateProfile}
          className={styles.form}
        >
          <Input
            label={t("account.profile.label.name")}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label={t("account.profile.label.email")}
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <div className={styles.formActions}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditing(false)}
            >
              {t("account.profile.cancelBtn")}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading
                ? t("account.profile.saving")
                : t("account.profile.saveBtn")}
            </Button>
          </div>
        </form>
      ) : (
        <div className={styles.infoGrid}>
          <div className={styles.infoGroup}>
            <label>{t("account.profile.label.name")}</label>
            <p>{userData?.name || t("account.profile.notAvailable")}</p>
          </div>
          <div className={styles.infoGroup}>
            <label>{t("account.profile.label.email")}</label>
            <p>{userData?.email || t("account.profile.notAvailable")}</p>
          </div>
          <div className={styles.infoGroup}>
            <label>{t("account.profile.label.id")}</label>
            <p className={styles.idText}>#{userId}</p>
          </div>
        </div>
      )}
    </div>
  );
};
