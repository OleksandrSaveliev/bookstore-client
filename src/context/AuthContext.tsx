import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

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
  // Alias 'authUser' as 'user' so existing components don't break
  user: AuthUser | null;
  userData: FullUser | null;
  login: (data: AuthUser) => void;
  logout: () => void;
  setUserData: (data: FullUser) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem("user");
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      return parsed.id ? parsed : null;
    } catch (e) {
      console.error("Auth initialization failed:", e);
      return null;
    }
  });

  const [userData, setUserData] = useState<FullUser | null>(null);

  const login = (data: AuthUser) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    setUserData(null);
    localStorage.removeItem("user");
    // Force a reload to clear any memory-stored cart states if necessary
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user, // Changed from authUser to user
        userData,
        login,
        logout,
        setUserData,
        isAuthenticated: !!user,
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
