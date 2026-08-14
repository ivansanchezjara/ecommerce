/**
 * Servicios para datos de la tienda (catálogo, config, precios).
 */

import { apiFetch } from "./api";

// ─── Configuración ──────────────────────────────────────────────────

/**
 * Obtiene la configuración pública de la tienda.
 */
export async function getConfig() {
  return apiFetch("/config/");
}

// ─── Categorías ─────────────────────────────────────────────────────

/**
 * Obtiene todas las categorías con productos publicados.
 */
export async function getCategorias() {
  return apiFetch("/categorias/");
}

// ─── Productos ──────────────────────────────────────────────────────

/**
 * Obtiene el listado de productos con filtros opcionales.
 * @param {Object} params - Filtros: categoria, brand, featured, sub_category, search, ordering
 * @param {AbortSignal} [signal] - Signal para cancelar la petición
 */
export async function getProductos(params = {}, signal) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });
  const query = searchParams.toString();
  const options = signal ? { signal } : {};
  return apiFetch(`/productos/${query ? `?${query}` : ""}`, options);
}

/**
 * Obtiene el detalle de un producto por su slug.
 * @param {string} slug
 * @param {AbortSignal} [signal] - Signal para cancelar la petición
 */
export async function getProducto(slug, signal) {
  const options = signal ? { signal } : {};
  return apiFetch(`/productos/${slug}/`, options);
}

/**
 * Obtiene productos relacionados (misma categoría).
 * @param {string} slug - Slug del producto
 */
export async function getProductosRelacionados(slug) {
  return apiFetch(`/productos/${slug}/relacionados/`);
}

/**
 * Obtiene las evaluaciones públicas de un producto.
 * @param {string} slug - Slug del producto
 */
export async function getEvaluacionesProducto(slug) {
  return apiFetch(`/productos/${slug}/evaluaciones/`);
}

/**
 * Obtiene las preguntas públicas de un producto.
 * @param {string} slug - Slug del producto
 */
export async function getPreguntasProducto(slug) {
  return apiFetch(`/productos/${slug}/preguntas/`);
}

/**
 * Envía una pregunta sobre un producto (requiere auth).
 * @param {string} slug - Slug del producto
 * @param {string} pregunta - Texto de la pregunta
 */
export async function crearPreguntaProducto(slug, pregunta) {
  return apiFetch(`/productos/${slug}/preguntas/`, {
    method: "POST",
    body: JSON.stringify({ pregunta }),
  });
}

/**
 * Obtiene las marcas disponibles con logo.
 * @returns {Promise<Array<{id, nombre, slug, logo_url}>>}
 */
export async function getMarcas() {
  return apiFetch("/productos/marcas/");
}

// ─── Precios (requiere auth) ────────────────────────────────────────

/**
 * Obtiene los precios de un producto según el tier del cliente.
 * @param {string} productoSlug
 * @param {string} moneda - Moneda para conversión (USD, PYG, BRL)
 */
export async function getPrecios(productoSlug, moneda = "USD") {
  const params = new URLSearchParams({ producto_slug: productoSlug });
  if (moneda !== "USD") params.append("moneda", moneda);
  return apiFetch(`/precios/?${params.toString()}`);
}

/**
 * Obtiene precios por IDs de variantes.
 * @param {number[]} varianteIds
 * @param {string} moneda
 */
export async function getPreciosByVariantes(varianteIds, moneda = "USD") {
  const params = new URLSearchParams({
    variante_ids: varianteIds.join(","),
  });
  if (moneda !== "USD") params.append("moneda", moneda);
  return apiFetch(`/precios/?${params.toString()}`);
}

// ─── Tipo de Cambio ─────────────────────────────────────────────────

/**
 * Obtiene los tipos de cambio actuales.
 */
export async function getTipoCambio() {
  return apiFetch("/tipo-cambio/");
}

// ─── Banners ────────────────────────────────────────────────────────

/**
 * Obtiene banners vigentes de la tienda.
 * @param {string} [ubicacion] - Filtrar por ubicación: hero, secundario, popup
 * @returns {Promise<Array<{id, titulo, subtitulo, imagen_url, enlace, boton_texto, ubicacion}>>}
 */
export async function getBanners(ubicacion) {
  const params = ubicacion ? `?ubicacion=${ubicacion}` : "";
  return apiFetch(`/banners/${params}`);
}

// ─── Catálogos PDF ──────────────────────────────────────────────────

/**
 * Obtiene catálogos PDF activos disponibles para descarga.
 * @param {string} [marca] - Filtrar por marca
 * @returns {Promise<Array<{id, titulo, descripcion, marca, portada_url, archivo_url}>>}
 */
export async function getCatalogos(marca) {
  const params = marca ? `?marca=${encodeURIComponent(marca)}` : "";
  return apiFetch(`/catalogos/${params}`);
}

// ─── Eventos ────────────────────────────────────────────────────

/**
 * Obtiene eventos activos de la tienda.
 * @returns {Promise<Array>}
 */
export async function getEventos() {
  return apiFetch("/eventos/");
}

// ─── Asesores / Vendedores ──────────────────────────────────────

/**
 * Obtiene los asesores/vendedores disponibles para atención.
 * @returns {Promise<Array<{id, nombre, email, avatar_url, whatsapp}>>}
 */
export async function getAsesores() {
  return apiFetch("/asesores/");
}
