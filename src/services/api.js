/**
 * Cliente base para comunicación con el backend del e-commerce.
 * Maneja auth headers, refresh de tokens y errores.
 */

import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/ecommerce";

/**
 * Realiza un fetch con configuración base.
 * Agrega Authorization header si hay token disponible.
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Agregar token si existe (solo client-side)
  if (typeof window !== "undefined") {
    const token = Cookies.get("ecommerce_access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Si el token expiró, intentar refresh
  if (response.status === 401 && typeof window !== "undefined") {
    const refreshed = await attemptTokenRefresh();
    if (refreshed) {
      // Reintentar con el nuevo token
      const newToken = Cookies.get("ecommerce_access_token");
      headers["Authorization"] = `Bearer ${newToken}`;
      const retryResponse = await fetch(url, { ...options, headers });
      if (!retryResponse.ok) {
        throw new ApiError(retryResponse.status, await retryResponse.json());
      }
      return retryResponse.json();
    } else {
      // Limpiar sesión silenciosamente — no lanzar error "Sesión expirada"
      // Los componentes que dependen de auth van a reaccionar al estado isLoggedIn=false
      clearSession();
      return null;
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData);
  }

  return response.json();
}

/**
 * Intenta refrescar el access token usando el refresh token.
 */
async function attemptTokenRefresh() {
  const refreshToken = Cookies.get("ecommerce_refresh_token");
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      Cookies.set("ecommerce_access_token", data.access, {
        secure: true,
        sameSite: "strict",
        expires: 1 / 24, // 1 hora
      });
      return true;
    }
  } catch {
    // Refresh falló
  }
  return false;
}

/**
 * Limpia los datos de sesión del cliente.
 */
export function clearSession() {
  if (typeof window !== "undefined") {
    Cookies.remove("ecommerce_access_token");
    Cookies.remove("ecommerce_refresh_token");
    Cookies.remove("ecommerce_cliente");
  }
}

/**
 * Clase de error customizada para respuestas de API.
 */
export class ApiError extends Error {
  constructor(status, data) {
    super(data?.detail || `Error ${status}`);
    this.status = status;
    this.data = data;
  }
}
