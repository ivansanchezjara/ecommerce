/**
 * Servicios de "Mi Cuenta" del e-commerce.
 * Direcciones, wishlist, historial, etc.
 */

import { apiFetch } from "./api";

// ─── Direcciones ────────────────────────────────────────────────────

/**
 * Obtiene todas las direcciones del cliente autenticado.
 * @returns {Promise<Array>}
 */
export async function getDirecciones() {
  return apiFetch("/direcciones/");
}

/**
 * Crea una nueva dirección.
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function crearDireccion(data) {
  return apiFetch("/direcciones/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Actualiza una dirección existente.
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function actualizarDireccion(id, data) {
  return apiFetch(`/direcciones/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Elimina (soft delete) una dirección.
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function eliminarDireccion(id) {
  // apiFetch intenta parsear JSON, pero DELETE devuelve 204.
  // Usamos try/catch para ignorar el error de parseo.
  try {
    await apiFetch(`/direcciones/${id}/`, { method: "DELETE" });
  } catch (err) {
    // Si es un error de API real (status >= 400), re-throw
    if (err.status && err.status >= 400) throw err;
    // Si es error de parseo JSON en 204, ignorar (éxito)
  }
}

/**
 * Marca una dirección como principal.
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function marcarDireccionPrincipal(id) {
  return apiFetch(`/direcciones/${id}/principal/`, {
    method: "POST",
  });
}

// ─── Wishlist ───────────────────────────────────────────────────────

/**
 * Obtiene la wishlist completa del cliente.
 * @returns {Promise<Array>}
 */
export async function getWishlist() {
  return apiFetch("/wishlist/");
}

/**
 * Obtiene solo los IDs de productos/variantes en la wishlist.
 * Útil para renderizar corazones en listados.
 * @returns {Promise<{ producto_ids: number[], variante_ids: number[] }>}
 */
export async function getWishlistIds() {
  return apiFetch("/wishlist/ids/");
}

/**
 * Toggle: agrega si no está, quita si está.
 * @param {number} productoId
 * @param {number|null} varianteId
 * @returns {Promise<{ action: "added"|"removed", item: Object|null }>}
 */
export async function toggleWishlist(productoId, varianteId = null) {
  return apiFetch("/wishlist/toggle/", {
    method: "POST",
    body: JSON.stringify({
      producto_id: productoId,
      variante_id: varianteId,
    }),
  });
}

/**
 * Elimina un item de la wishlist por su ID.
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function eliminarWishlistItem(id) {
  try {
    await apiFetch(`/wishlist/${id}/`, { method: "DELETE" });
  } catch (err) {
    if (err.status && err.status >= 400) throw err;
  }
}


// ─── Mis Pedidos ────────────────────────────────────────────────────

/**
 * Obtiene los pedidos del cliente filtrados por estado.
 * @param {"todos"|"por_pagar"|"por_enviar"|"enviado"|"cancelado"} estado
 * @returns {Promise<Array>}
 */
export async function getMisPedidos(estado = "todos") {
  const params = estado !== "todos" ? `?estado=${estado}` : "";
  return apiFetch(`/mis-pedidos/${params}`);
}

// ─── Evaluaciones de Productos ──────────────────────────────────────

/**
 * Obtiene las evaluaciones del cliente.
 * @returns {Promise<Array>}
 */
export async function getMisEvaluaciones() {
  return apiFetch("/evaluaciones/");
}

/**
 * Obtiene productos comprados pendientes de evaluar.
 * @returns {Promise<Array>}
 */
export async function getProductosPendientesEvaluar() {
  return apiFetch("/evaluaciones/pendientes/");
}

/**
 * Crea una nueva evaluación de producto.
 * @param {{ producto: number, variante?: number, venta?: number, rating: number, titulo?: string, comentario?: string }} data
 * @returns {Promise<Object>}
 */
export async function crearEvaluacion(data) {
  return apiFetch("/evaluaciones/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Actualiza una evaluación existente.
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function actualizarEvaluacion(id, data) {
  return apiFetch(`/evaluaciones/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Elimina una evaluación.
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function eliminarEvaluacion(id) {
  try {
    await apiFetch(`/evaluaciones/${id}/`, { method: "DELETE" });
  } catch (err) {
    if (err.status && err.status >= 400) throw err;
  }
}

// ─── Historial de Búsqueda ──────────────────────────────────────────

/**
 * Obtiene el historial de búsquedas del cliente (últimas únicas).
 * @returns {Promise<Array>}
 */
export async function getHistorialBusquedas() {
  return apiFetch("/busquedas/");
}

/**
 * Registra una búsqueda realizada por el cliente.
 * Se llama automáticamente al buscar en la tienda.
 * @param {string} termino
 * @param {number} resultadosCount
 * @returns {Promise<Object>}
 */
export async function registrarBusqueda(termino, resultadosCount = 0) {
  return apiFetch("/busquedas/", {
    method: "POST",
    body: JSON.stringify({
      termino,
      resultados_count: resultadosCount,
    }),
  });
}

/**
 * Elimina una búsqueda específica del historial.
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function eliminarBusqueda(id) {
  try {
    await apiFetch(`/busquedas/${id}/`, { method: "DELETE" });
  } catch (err) {
    if (err.status && err.status >= 400) throw err;
  }
}

/**
 * Limpia todo el historial de búsquedas del cliente.
 * @returns {Promise<void>}
 */
export async function limpiarHistorialBusquedas() {
  try {
    await apiFetch("/busquedas/", { method: "DELETE" });
  } catch (err) {
    if (err.status && err.status >= 400) throw err;
  }
}

// ─── Cupones ────────────────────────────────────────────────────────

/**
 * Obtiene los cupones del cliente filtrados por estado.
 * @param {"todos"|"disponibles"|"usados"|"vencidos"} estado
 * @returns {Promise<Array>}
 */
export async function getMisCupones(estado = "todos") {
  const params = estado !== "todos" ? `?estado=${estado}` : "";
  return apiFetch(`/cupones/${params}`);
}


// ─── Formas de Pago ─────────────────────────────────────────────────

/**
 * Obtiene las formas de pago del cliente.
 * @returns {Promise<Array>}
 */
export async function getFormasPago() {
  return apiFetch("/formas-pago/");
}

/**
 * Crea una nueva forma de pago.
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function crearFormaPago(data) {
  return apiFetch("/formas-pago/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Actualiza una forma de pago.
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function actualizarFormaPago(id, data) {
  return apiFetch(`/formas-pago/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Elimina una forma de pago.
 * @param {number} id
 */
export async function eliminarFormaPago(id) {
  try {
    await apiFetch(`/formas-pago/${id}/`, { method: "DELETE" });
  } catch (err) {
    if (err.status && err.status >= 400) throw err;
  }
}

/**
 * Marca una forma de pago como principal.
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function marcarFormaPagoPrincipal(id) {
  return apiFetch(`/formas-pago/${id}/principal/`, { method: "POST" });
}

// ─── Asistencia / Garantía ──────────────────────────────────────────

/**
 * Obtiene las solicitudes de asistencia del cliente.
 * @returns {Promise<Array>}
 */
export async function getMisSolicitudesAsistencia() {
  return apiFetch("/asistencia/");
}

/**
 * Crea una nueva solicitud de asistencia/garantía.
 * @param {{ tipo: string, producto?: number, venta?: number, descripcion: string, numero_serie?: string }} data
 * @returns {Promise<Object>}
 */
export async function crearSolicitudAsistencia(data) {
  return apiFetch("/asistencia/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── Relaciones Profesionales ───────────────────────────────────────

/**
 * Busca instituciones por nombre/abreviatura.
 * @param {string} search
 * @returns {Promise<Array<{ id, razon_social, abreviatura, tipo_institucion }>>}
 */
export async function buscarInstituciones(search) {
  return apiFetch(`/instituciones/?search=${encodeURIComponent(search)}`);
}

/**
 * Obtiene las ofertas académicas de una institución.
 * @param {number} institucionId
 * @returns {Promise<Array<{ id, nombre, tipo, duracion_anios }>>}
 */
export async function getOfertasAcademicas(institucionId) {
  return apiFetch(`/instituciones/${institucionId}/ofertas/`);
}

/**
 * Busca clínicas por nombre/razón social.
 * @param {string} search
 * @returns {Promise<Array<{ id, razon_social, nombre_comercial }>>}
 */
export async function buscarClinicas(search) {
  return apiFetch(`/clinicas/?search=${encodeURIComponent(search)}`);
}

/**
 * Agrega una formación académica.
 * @param {{ institucion_id, oferta_academica_id?, tipo, anio_ingreso?, anio_egreso?, titulo_obtenido? }} data
 * @returns {Promise<Object>}
 */
export async function crearFormacion(data) {
  return apiFetch("/mis-formaciones/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Elimina una formación académica.
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function eliminarFormacion(id) {
  try {
    await apiFetch(`/mis-formaciones/${id}/`, { method: "DELETE" });
  } catch (err) {
    if (err.status && err.status >= 400) throw err;
  }
}

/**
 * Agrega un vínculo laboral (dónde trabaja).
 * @param {{ clinica_id, cargo?, especialidad? }} data
 * @returns {Promise<Object>}
 */
export async function crearVinculoLaboral(data) {
  return apiFetch("/mis-vinculos/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Elimina (desactiva) un vínculo laboral.
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function eliminarVinculoLaboral(id) {
  try {
    await apiFetch(`/mis-vinculos/${id}/`, { method: "DELETE" });
  } catch (err) {
    if (err.status && err.status >= 400) throw err;
  }
}

/**
 * Agrega un vínculo docente (dónde enseña).
 * @param {{ institucion_id, oferta_academica_id?, catedra?, tipo? }} data
 * @returns {Promise<Object>}
 */
export async function crearVinculoDocente(data) {
  return apiFetch("/mis-vinculos-docentes/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Elimina (desactiva) un vínculo docente.
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function eliminarVinculoDocente(id) {
  try {
    await apiFetch(`/mis-vinculos-docentes/${id}/`, { method: "DELETE" });
  } catch (err) {
    if (err.status && err.status >= 400) throw err;
  }
}
