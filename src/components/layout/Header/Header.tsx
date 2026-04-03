// src/components/layout/Header/Header.tsx
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../ui/Button/Button";
import { useAuth } from "../../../context/AuthContext";
import { authService } from "../../../api/auth.service";
import { useCart } from "../../../context/CartContext";
import styles from "./Header.module.css";

export const Header = () => {
  const { isAuthenticated, isEmployee, user, logout } = useAuth();
  const navigate = useNavigate();

  // 1. Destructure cartCount instead of just cart
  const { cartCount } = useCart();

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

        {/* CART: Only show if NOT an employee */}
        {!isEmployee && (
          <Link
            to="/cart"
            className={styles.cartLink}
          >
            <div className={styles.cartIconWrapper}>
              🛒
              {/* 2. Use cartCount here so the badge reflects quantities */}
              {cartCount > 0 && (
                <span className={styles.badge}>{cartCount}</span>
              )}
            </div>
            <span className={styles.cartLabel}>Cart</span>
          </Link>
        )}

        {isAuthenticated ? (
          <>
            {isEmployee ? (
              <Button
                to="/admin"
                variant="ghost"
              >
                Admin
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
          <>
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
          </>
        )}
      </div>
    </header>
  );
};
