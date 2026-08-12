/**
 * Genera una llave única y estable por fila de la tabla de rutas,
 * incluso cuando la fila no tiene una solicitud de recolección asociada
 * (requestId null). Necesario porque varias filas sin solicitud comparten
 * requestId === null y no pueden distinguirse entre sí con ese campo.
 *
 * @param {Object} row - Fila de datos de la tabla (RouteInfo).
 * @returns {string} Llave única de la fila.
 */
export function getRowKey(row) {
    return row.requestId ?? `new-${row.clientId}`;
}