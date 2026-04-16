import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("vab_token");
    const saved = localStorage.getItem("vab_user");
    if (token && saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Invalid credentials");
    localStorage.setItem("vab_token", data.token);
    localStorage.setItem("vab_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("vab_token");
    localStorage.removeItem("vab_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
