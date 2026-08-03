/**
 * Cliente base para comunicación con el backend del e-commerce.
 * Maneja auth headers, refresh de tokens y errores.
 */

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
    const token = localStorage.getItem("ecommerce_access_token");
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
      const newToken = localStorage.getItem("ecommerce_access_token");
      headers["Authorization"] = `Bearer ${newToken}`;
      const retryResponse = await fetch(url, { ...options, headers });
      if (!retryResponse.ok) {
        throw new ApiError(retryResponse.status, await retryResponse.json());
      }
      return retryResponse.json();
    } else {
      // Limpiar sesión
      clearSession();
      throw new ApiError(401, { detail: "Sesión expirada" });
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
  const refreshToken = localStorage.getItem("ecommerce_refresh_token");
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("ecommerce_access_token", data.access);
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
    localStorage.removeItem("ecommerce_access_token");
    localStorage.removeItem("ecommerce_refresh_token");
    localStorage.removeItem("ecommerce_cliente");
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
