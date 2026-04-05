import React, { useState, useEffect } from "react";
import {
  useLocation,
  useNavigate,
  Link,
  useSearchParams,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../api/auth.service";
import { Input } from "../../components/ui/Input/Input";
import { Button } from "../../components/ui/Button/Button";
import styles from "./Auth.module.css";
import { useTranslation } from "react-i18next"; // Added

const AuthPage = () => {
  const { t } = useTranslation(); // Added
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const isLogin = location.pathname === "/login";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError("");
  }, [isLogin]);

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/";
    return (
      <Navigate
        to={from}
        replace
      />
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userResponse = isLogin
        ? await authService.signin(formData)
        : (await authService.signup(formData),
          await authService.signin(formData));

      login(userResponse);
      navigate(searchParams.get("redirect") || "/");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        t("auth.error.unexpected"); // Translated fallback

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} fade-in`}>
        <h2>{isLogin ? t("auth.login.title") : t("auth.register.title")}</h2>
        <p className={styles.subtitle}>
          {isLogin ? t("auth.login.subtitle") : t("auth.register.subtitle")}
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <Input
              label={t("auth.labels.name")}
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          )}
          <Input
            label={t("auth.labels.email")}
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <Input
            label={t("auth.labels.password")}
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading
              ? t("auth.processing")
              : isLogin
                ? t("auth.login.submit")
                : t("auth.register.submit")}
          </Button>
        </form>

        <div className={styles.footer}>
          {isLogin ? t("auth.login.footerText") : t("auth.register.footerText")}
          <Link
            to={isLogin ? "/signup" : "/login"}
            className={styles.link}
          >
            {isLogin
              ? t("auth.login.footerLink")
              : t("auth.register.footerLink")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
