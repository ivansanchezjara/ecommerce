/**
 * Servicios de autenticación del e-commerce.
 * Base URL ya incluye /api/ecommerce — los endpoints son relativos a eso.
 */

import Cookies from "js-cookie";
import { apiFetch, clearSession } from "./api";

const COOKIE_SECURE_OPTIONS = {
  secure: true,
  sameSite: "strict",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Detecta si el identificador es email o celular.
 * @param {string} identificador
 * @returns {"email"|"whatsapp"}
 */
export function detectarCanal(identificador) {
  return identificador.includes("@") ? "email" : "whatsapp";
}

// ─── Flujo unificado ─────────────────────────────────────────────────────────

/**
 * Paso 1: determina el estado del identificador.
 * @param {string} identificador  Email o celular
 * @returns {Promise<{ estado: "login"|"activar"|"registrar", canal: "email"|"whatsapp", razon_social: string|null }>}
 */
export async function verificarIdentidad(identificador) {
  return apiFetch("/auth/verificar-identidad/", {
    method: "POST",
    body: JSON.stringify({ identificador }),
  });
}

/**
 * Paso 2a: envía código OTP al email o celular.
 * @param {string} identificador
 * @param {"activar"|"registrar"} proposito
 * @returns {Promise<{ detail: string, canal: string, codigo_debug?: string }>}
 */
export async function enviarCodigo(identificador, proposito) {
  return apiFetch("/auth/enviar-codigo/", {
    method: "POST",
    body: JSON.stringify({ identificador, proposito }),
  });
}

/**
 * Paso 2b: verifica el código OTP ingresado.
 * @param {string} identificador
 * @param {string} codigo
 * @param {"activar"|"registrar"} proposito
 * @returns {Promise<{ verificado: boolean, token_verificacion_id: number }>}
 */
export async function verificarCodigo(identificador, codigo, proposito) {
  return apiFetch("/auth/verificar-codigo/", {
    method: "POST",
    body: JSON.stringify({ identificador, codigo, proposito }),
  });
}

/**
 * Paso 3a: activa una cuenta existente del ERP creando contraseña.
 * @param {string} identificador
 * @param {string} password
 * @param {number} tokenVerificacionId
 * @returns {Promise<{ access, refresh, cliente }>}
 */
export async function activarCuenta(identificador, password, tokenVerificacionId) {
  const data = await apiFetch("/auth/activar/", {
    method: "POST",
    body: JSON.stringify({
      identificador,
      password,
      token_verificacion_id: tokenVerificacionId,
    }),
  });
  _guardarSesion(data);
  return data;
}

/**
 * Paso 3b: registra una cuenta nueva.
 * @param {{ identificador, password, razon_social, celular, tokenVerificacionId }} params
 * @returns {Promise<{ access, refresh, cliente }>}
 */
export async function registrarCliente({
  identificador,
  password,
  razon_social,
  celular = "",
  tokenVerificacionId,
}) {
  const data = await apiFetch("/auth/registrar/", {
    method: "POST",
    body: JSON.stringify({
      identificador,
      password,
      razon_social,
      celular,
      token_verificacion_id: tokenVerificacionId,
    }),
  });
  _guardarSesion(data);
  return data;
}

// ─── Login normal ─────────────────────────────────────────────────────────────

/**
 * Login con email/celular + contraseña.
 * @param {string} identificador  Email o celular
 * @param {string} password
 * @returns {Promise<{ access, refresh, cliente }>}
 */
export async function login(identificador, password) {
  const data = await apiFetch("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ identificador, password }),
  });
  _guardarSesion(data);
  return data;
}

// ─── Sesión ──────────────────────────────────────────────────────────────────

/** Logout del cliente. */
export function logout() {
  clearSession();
}

/** Obtiene el perfil del cliente autenticado. */
export async function getPerfil() {
  return apiFetch("/auth/perfil/");
}

/** Verifica si hay sesión activa (client-side). */
export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  const token = Cookies.get("ecommerce_access_token");
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(
      window.atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

/** Obtiene los datos del cliente almacenados localmente. */
export function getClienteLocal() {
  if (typeof window === "undefined") return null;
  const raw = Cookies.get("ecommerce_cliente");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Actualiza los datos del cliente almacenados localmente. */
export function updateClienteLocal(cliente) {
  if (typeof window === "undefined") return;
  if (!cliente) {
    Cookies.remove("ecommerce_cliente");
    return;
  }
  Cookies.set("ecommerce_cliente", JSON.stringify(cliente), {
    ...COOKIE_SECURE_OPTIONS,
    expires: 7,
  });
}

// ─── Internos ─────────────────────────────────────────────────────────────────

function _guardarSesion(data) {
  Cookies.set("ecommerce_access_token", data.access, {
    ...COOKIE_SECURE_OPTIONS,
    expires: 1 / 24,
  });
  Cookies.set("ecommerce_refresh_token", data.refresh, {
    ...COOKIE_SECURE_OPTIONS,
    expires: 1,
  });
  updateClienteLocal(data.cliente);
}
