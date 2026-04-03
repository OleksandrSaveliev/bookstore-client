import { createContext, useContext, useState, type ReactNode } from "react";

export interface User {
  id: number;
  email: string;
  name: string;
  balance: number;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  refreshUser: (updatedData: User) => void;
  isAuthenticated: boolean;
  isEmployee: boolean;
  isClient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const refreshUser = (updatedData: User) => {
    setUser(updatedData);
    localStorage.setItem("user", JSON.stringify(updatedData));
  };

  const value = {
    user,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isEmployee: (user?.roles || []).includes("ROLE_EMPLOYEE"),
    isClient: (user?.roles || []).includes("ROLE_CLIENT"),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
