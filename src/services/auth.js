/**
 * Servicios de autenticación del e-commerce.
 */

import Cookies from "js-cookie";
import { apiFetch, clearSession } from "./api";

// Opciones de seguridad para las cookies
const COOKIE_SECURE_OPTIONS = {
  secure: true,
  sameSite: "strict",
};

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

  // Guardar tokens y datos del cliente en cookies seguras
  Cookies.set("ecommerce_access_token", data.access, {
    ...COOKIE_SECURE_OPTIONS,
    expires: 1 / 24, // 1 hora
  });
  Cookies.set("ecommerce_refresh_token", data.refresh, {
    ...COOKIE_SECURE_OPTIONS,
    expires: 1, // 1 día
  });
  updateClienteLocal(data.cliente);

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
  
  const token = Cookies.get("ecommerce_access_token");
  if (!token) return false;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64));
    
    // Validar exp (en segundos) contra el timestamp actual
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

/**
 * Obtiene los datos del cliente almacenados localmente.
 */
export function getClienteLocal() {
  if (typeof window === "undefined") return null;
  const raw = Cookies.get("ecommerce_cliente");
  if (!raw) return null;
  
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error al parsear ecommerce_cliente:", e);
    return null;
  }
}

/**
 * Actualiza los datos del cliente almacenados localmente.
 */
export function updateClienteLocal(cliente) {
  if (typeof window === "undefined") return;
  if (!cliente) {
    Cookies.remove("ecommerce_cliente");
    return;
  }
  Cookies.set("ecommerce_cliente", JSON.stringify(cliente), {
    ...COOKIE_SECURE_OPTIONS,
    expires: 7, // 7 días
  });
}

