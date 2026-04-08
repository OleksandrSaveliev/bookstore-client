import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import axios from "axios";

interface AuthUser {
  id: number;
  email: string;
  roles: string[];
}

export interface FullUser extends AuthUser {
  name: string;
  balance: number;
}

interface AuthContextType {
  user: AuthUser | null;
  userData: FullUser | null;
  login: (data: AuthUser) => void;
  logout: () => Promise<void>;
  setUserData: (data: FullUser) => void;
  isAuthenticated: boolean;
  isEmployee: boolean;
  isClient: boolean;
  isAdmin: boolean; // Added for your new Admin user
  loading: boolean;
  refreshUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_ME_URL = "http://localhost:8084/api/v1/users/me";
const AUTH_BASE_URL = "http://localhost:8084/api/v1/auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userData, setUserData] = useState<FullUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to check roles regardless of "ROLE_" prefix
  const hasRole = (roleNames: string[]) => {
    return !!user?.roles?.some((r) =>
      roleNames.some((name) => r === name || r === `ROLE_${name}`),
    );
  };

  const isAdmin = useMemo(() => hasRole(["ADMIN"]), [user]);
  const isEmployee = useMemo(() => hasRole(["EMPLOYEE", "ADMIN"]), [user]); // Admins usually see employee pages
  const isClient = useMemo(() => hasRole(["CLIENT", "USER"]), [user]);

  const refreshUser = async (): Promise<AuthUser | null> => {
    try {
      const response = await axios.get(USER_ME_URL, {
        withCredentials: true,
      });

      const data = response.data;
      if (data) {
        setUser(data);
        setUserData(data);
        localStorage.setItem("user", JSON.stringify(data));
        return data;
      }
      return null;
    } catch (error) {
      setUser(null);
      setUserData(null);
      localStorage.removeItem("user");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
    refreshUser();
  }, []);

  const login = (data: AuthUser) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = async () => {
    try {
      await axios.post(
        `${AUTH_BASE_URL}/logout`,
        {},
        { withCredentials: true },
      );
    } catch (error) {
      console.error("Logout request failed", error);
    } finally {
      setUser(null);
      setUserData(null);
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        login,
        logout,
        setUserData,
        isAuthenticated: !!user,
        isEmployee,
        isClient,
        isAdmin,
        loading,
        refreshUser,
      }}
    >
      {!loading ? (
        children
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p>Verifying session...</p>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
