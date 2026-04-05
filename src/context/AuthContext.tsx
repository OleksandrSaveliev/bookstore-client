import { createContext, useContext, useState, ReactNode } from "react";

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
  logout: () => void;
  setUserData: (data: FullUser) => void;
  isAuthenticated: boolean;
  // --- New Helper Booleans ---
  isEmployee: boolean;
  isClient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem("user");
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      // Ensure it has an ID and roles array
      return parsed.id && Array.isArray(parsed.roles) ? parsed : null;
    } catch (e) {
      console.error("Auth initialization failed:", e);
      return null;
    }
  });

  const [userData, setUserData] = useState<FullUser | null>(null);

  // --- Logic to handle "ROLE_" prefix flexibly ---
  const isEmployee = !!user?.roles?.some(
    (role) => role === "ROLE_EMPLOYEE" || role === "EMPLOYEE",
  );

  const isClient = !!user?.roles?.some(
    (role) => role === "ROLE_CLIENT" || role === "CLIENT" || role === "USER",
  );

  const login = (data: AuthUser) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    setUserData(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Good practice to clear token too
    window.location.href = "/login";
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
        isEmployee, // Exposed here
        isClient, // Exposed here
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
