"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { login as loginService, logout as logoutService, isAuthenticated, getClienteLocal, getPerfil, updateClienteLocal } from "@/services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [cliente, setCliente] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Inicializar estado desde cookies/tokens
  useEffect(() => {
    async function initAuth() {
      if (isAuthenticated()) {
        // Access token válido, cargar datos locales
        const clienteLocal = getClienteLocal();
        if (clienteLocal) {
          setCliente(clienteLocal);
          setIsLoggedIn(true);
        }
      } else {
        // Access token expirado o ausente — verificar si hay refresh disponible
        const Cookies = (await import("js-cookie")).default;
        const refreshToken = Cookies.get("ecommerce_refresh_token");

        if (refreshToken) {
          // Intentar refresh silencioso sin lanzar errores a la UI
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/ecommerce"}/auth/refresh/`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: refreshToken }),
              }
            );

            if (response.ok) {
              const data = await response.json();
              Cookies.set("ecommerce_access_token", data.access, {
                secure: true,
                sameSite: "strict",
                expires: 1 / 24,
              });
              // Ahora podemos cargar perfil
              const perfil = await getPerfil();
              setCliente(perfil);
              setIsLoggedIn(true);
              updateClienteLocal(perfil);
            } else {
              // Refresh inválido — limpiar sesión silenciosamente
              logoutService();
            }
          } catch {
            // Error de red u otro — limpiar sin mostrar errores
            logoutService();
          }
        }
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const login = useCallback(async (identificador, password) => {
    const data = await loginService(identificador, password);
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
      updateClienteLocal(perfil);
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
