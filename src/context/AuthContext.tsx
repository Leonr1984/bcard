import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types";
import { jwtDecode } from "jwt-decode";
import { apiService } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    phone: string,
    isBusiness: boolean
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isBusiness: boolean;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
          try {
            const decoded = jwtDecode<any>(savedToken);
            const parsedUser = JSON.parse(savedUser);

            setToken(savedToken);
            setUser(parsedUser);
          } catch (decodeError) {
            console.error("Failed to decode token or parse user:", decodeError);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            setToken(null);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { token: newToken } = await apiService.login({
        email,
        password,
      });

      if (!newToken) {
        throw new Error("No token received from server");
      }

      const decoded = jwtDecode<any>(newToken);

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(decoded));

      setToken(newToken);
      setUser(decoded);
    } catch (err: any) {
      const errorMessage = err.response?.data || err.message || "Login failed";
      setError(errorMessage);
      console.error("Login error:", errorMessage);
      throw err;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone: string,
    isBusiness: boolean
  ) => {
    try {
      setError(null);
      await apiService.register({
        name: {
          first: name.split(" ")[0] || name,
          middle: "",
          last: name.split(" ")[1] || "",
        },
        phone,
        email,
        password,
        image: {
          url: "",
          alt: "",
        },
        address: {
          state: "",
          country: "Israel",
          city: "",
          street: "",
          houseNumber: 0,
          zip: 0,
        },
        isBusiness,
      });

      await login(email, password);
    } catch (err: any) {
      const errorMessage =
        err.response?.data || err.message || "Registration failed";
      setError(errorMessage);
      console.error("Register error:", errorMessage);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    isBusiness: user?.isBusiness || false,
    isAdmin: user?.isAdmin || false,
    setUser,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
