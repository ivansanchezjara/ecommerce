/**
 * Configuración de categorías.
 * Las categorías se cargan dinámicamente desde el API.
 * Este archivo provee helpers para trabajar con ellas.
 */

/**
 * DEPRECADO: Las categorías ahora vienen del API.
 * Se mantiene como puente para routeResolver.js hasta que se migre.
 * @param {string} slug
 * @returns {null}
 */
export function getCategoryConfig(slug) {
  return null;
}

/**
 * Genera la metadata de SEO para una categoría.
 * @param {Object} categoria - Objeto de categoría del API {id, nombre, descripcion}
 * @returns {Object} Metadata para la página
 */
export function getCategoryMetadata(categoria) {
  if (!categoria) return null;
  return {
    title: categoria.nombre,
    description: categoria.descripcion || `Productos de la categoría ${categoria.nombre}`,
  };
}
