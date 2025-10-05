"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthContextType {
  user: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ logout'u useCallback ile tanımladık
  const logout = useCallback(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    router.push("/login");
  }, [router]);

  // ⏳ Refresh token on mount
  useEffect(() => {
    const refresh = async () => {
      const refreshToken = localStorage.getItem("refresh");
      if (!refreshToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/users/token/refresh/`,
          { refresh: refreshToken }
        );
        localStorage.setItem("access", res.data.access);
        setUser("authenticated");
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    refresh();
  }, [logout]); // ✅ eslint uyarısı gitti

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/token/`, {
        username,
        password,
      });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      setUser(username);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
