/**
 * Servicios de autenticación del e-commerce.
 */

import { apiFetch, clearSession } from "./api";

/**
 * Login del cliente.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{access, refresh, cliente}>}
 */
export async function login(username, password) {
  const data = await apiFetch("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  // Guardar tokens y datos del cliente
  localStorage.setItem("ecommerce_access_token", data.access);
  localStorage.setItem("ecommerce_refresh_token", data.refresh);
  localStorage.setItem("ecommerce_cliente", JSON.stringify(data.cliente));

  return data;
}

/**
 * Logout del cliente.
 */
export function logout() {
  clearSession();
}

/**
 * Obtiene el perfil del cliente autenticado.
 */
export async function getPerfil() {
  return apiFetch("/auth/perfil/");
}

/**
 * Verifica si hay sesión activa (client-side).
 */
export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("ecommerce_access_token");
}

/**
 * Obtiene los datos del cliente almacenados localmente.
 */
export function getClienteLocal() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("ecommerce_cliente");
  return raw ? JSON.parse(raw) : null;
}
