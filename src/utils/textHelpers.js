/**
 * Normaliza texto removiendo acentos y convirtiendo a minúsculas
 * Útil para búsquedas insensibles a acentos
 * @param {string} text - Texto a normalizar
 * @returns {string} Texto normalizado
 */
export function normalizeText(text) {
  return text
    ? text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    : "";
}

/**
 * Capitaliza la primera letra de un string
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizado
 */
export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convierte un nombre a slug (URL-friendly)
 * @param {string} name - Nombre a convertir
 * @returns {string} Slug generado
 */
export function toSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
    .replace(/\s+/g, "-"); // Espacios a guiones
}
