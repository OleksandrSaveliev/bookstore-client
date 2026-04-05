import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../ui/Button/Button";
import { useAuth } from "../../../context/AuthContext";
import { authService } from "../../../api/auth.service";
import { useCart } from "../../../context/CartContext";
import styles from "./Header.module.css";
import { useTranslation } from "react-i18next";

export const Header = () => {
  const { isAuthenticated, isEmployee, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // Destructure 't' here

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <header className={styles.header}>
      <Link
        to="/"
        className={styles.logo}
      >
        📚 <span className={styles.logoText}>BookStore</span>
      </Link>

      <div className={styles.navActions}>
        <div className={styles.langSwitch}>
          <button
            className={`${styles.langBtn} ${i18n.language === "en" ? styles.activeLang : ""}`}
            onClick={() => changeLanguage("en")}
          >
            EN
          </button>
          <button
            className={`${styles.langBtn} ${i18n.language.startsWith("ua") ? styles.activeLang : ""}`}
            onClick={() => changeLanguage("ua")}
          >
            UA
          </button>
        </div>

        {!isEmployee && (
          <Link
            to="/cart"
            className={styles.cartLink}
          >
            <div className={styles.cartIconWrapper}>
              🛒
              {cartCount > 0 && (
                <span className={styles.badge}>{cartCount}</span>
              )}
            </div>
            <span className={styles.cartLabel}> {t("nav.cart")}</span>
          </Link>
        )}

        <div className={styles.authSection}>
          {isAuthenticated ? (
            <>
              {isEmployee ? (
                <Button
                  to="/admin"
                  variant="ghost"
                  className={styles.adminBtn}
                >
                  {t("nav.adminPanel")}
                </Button>
              ) : (
                <Button
                  to="/account"
                  variant="ghost"
                >
                  {t("nav.myAccount")}
                </Button>
              )}

              <span className={styles.userEmail}>{user?.email}</span>

              <Button
                onClick={handleLogout}
                variant="primary"
              >
                {t("nav.logout")}
              </Button>
            </>
          ) : (
            <div className={styles.guestActions}>
              <Button
                to="/login"
                variant="ghost"
              >
                {t("nav.login")}
              </Button>
              <Button
                to="/signup"
                variant="primary"
              >
                {t("nav.signup")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
