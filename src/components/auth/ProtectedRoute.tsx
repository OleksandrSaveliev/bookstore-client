import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Props {
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (allowedRoles) {
    const userRoles = user?.roles || [];
    const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasAccess) {
      return (
        <Navigate
          to="/"
          replace
        />
      );
    }
  }

  return <Outlet />;
};
