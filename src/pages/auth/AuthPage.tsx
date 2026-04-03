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
import axios from "axios";

const AuthPage = () => {
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
      // We grab the message directly from the backend response body
      // or fallback to a hardcoded string if the server is down/empty
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} fade-in`}>
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p className={styles.subtitle}>
          {isLogin
            ? "Log in to manage your library."
            : "Join our community of book lovers."}
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          )}
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <Input
            label="Password"
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
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </Button>
        </form>

        <div className={styles.footer}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <Link
            to={isLogin ? "/signup" : "/login"}
            className={styles.link}
          >
            {isLogin ? "Sign up" : "Log in"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
