// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState } from "react";
import { UserModel } from "../types";
import { callApi } from "../api/api";

interface UserContextType {
  user: UserModel | null;
  register: (user: Omit<UserModel, "_id" | "token" | "username">) => void;
  login: (user: Omit<UserModel, "_id" | "token" | "username" | "name">) => void;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const register = async (newUser: Omit<UserModel, "_id" | "token" | "username">) => {
    try {
      setIsLoading(true);
      const { user, token } = await callApi({
        data: newUser,
        requestType: "POST",
        endpoint: "/users/register",
      });
      setUser({ ...user, token });
      setError(null);
    } catch (err) {
      setError("Unable to register. Please try again.");
      console.error("Ristration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (newUser: Omit<UserModel, "_id" | "token" | "username" | "name">) => {
    try {
      setIsLoading(true);
      const { user, token } = await callApi({
        data: newUser,
        requestType: "POST",
        endpoint: "/users/login",
      });
      setUser({ ...user, token });
      setError(null);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = { user, register, login, logout, isLoading, error };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
