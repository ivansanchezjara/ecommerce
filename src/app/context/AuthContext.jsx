"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { login as loginService, logout as logoutService, isAuthenticated, getClienteLocal, getPerfil } from "@/services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [cliente, setCliente] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Inicializar estado desde localStorage
  useEffect(() => {
    if (isAuthenticated()) {
      const clienteLocal = getClienteLocal();
      if (clienteLocal) {
        setCliente(clienteLocal);
        setIsLoggedIn(true);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await loginService(username, password);
    setCliente(data.cliente);
    setIsLoggedIn(true);
    return data;
  }, []);

  const logout = useCallback(() => {
    logoutService();
    setCliente(null);
    setIsLoggedIn(false);
  }, []);

  const refreshPerfil = useCallback(async () => {
    try {
      const perfil = await getPerfil();
      setCliente(perfil);
      localStorage.setItem("ecommerce_cliente", JSON.stringify(perfil));
    } catch {
      // Si falla, logout
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        cliente,
        isLoggedIn,
        loading,
        login,
        logout,
        refreshPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
