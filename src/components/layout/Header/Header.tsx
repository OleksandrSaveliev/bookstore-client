import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../ui/Button/Button";
import { useAuth } from "../../../context/AuthContext";
import { authService } from "../../../api/auth.service";
import { useCart } from "../../../context/CartContext";
import styles from "./Header.module.css";

export const Header = () => {
  const { isAuthenticated, isEmployee, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

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
          <button className={styles.langBtn}>EN</button>
          <button className={styles.langBtn}>UA</button>
        </div>

        {/* 1. Only show Cart to non-employees or guests */}
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
            <span className={styles.cartLabel}>Cart</span>
          </Link>
        )}

        <div className={styles.authSection}>
          {isAuthenticated ? (
            <>
              {/* 2. Role-based Navigation Toggle */}
              {isEmployee ? (
                <Button
                  to="/admin"
                  variant="ghost"
                  className={styles.adminBtn}
                >
                  Admin Panel
                </Button>
              ) : (
                <Button
                  to="/account"
                  variant="ghost"
                >
                  My Account
                </Button>
              )}

              <span className={styles.userEmail}>{user?.email}</span>

              <Button
                onClick={handleLogout}
                variant="primary"
              >
                Logout
              </Button>
            </>
          ) : (
            <div className={styles.guestActions}>
              <Button
                to="/login"
                variant="ghost"
              >
                Login
              </Button>
              <Button
                to="/signup"
                variant="primary"
              >
                Join
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
