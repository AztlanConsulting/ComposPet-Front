/**
 * Interfaz abstracta del repositorio de solicitudes de recolección
 * Define el contrato que deben cumplir todas las implementaciones
 * del repositorio dentro de la capa de datos.
 *
 * Cualquier clase que extienda esta interfaz debe sobrescribir
 * los metodos definidos si no dara error
 *
 * @abstract
 */

export class CollectionRequestIRepository {
    /**
     * Obtiene la solicitud de recolección actual del cliente dentro del rango semanal indicado.
     *
     * @abstract
     * @param {string} clientId - Id del cliente.
     * @param {string} weekStartDate - Fecha inicial del rango semanal.
     * @param {string} weekEndDate - Fecha final del rango semanal.
     * @throws {Error} Cuando el método no es implementado por la clase hija.
     */

    async getCurrentCollectionRequest(clientId, weekStartDate, weekEndDate){
        throw new Error("collectionRequestIRepositoryo no implementado");
    }

    /**
     * Guarda la información de la primera sección del formulario de recolección.
     *
     * @abstract
     * @param {string} requestId - Id de la solicitud.
     * @param {boolean} wantsCollection - Indica si el cliente desea recolección.
     * @param {boolean} wantsExtraProducts - Indica si el cliente desea productos extra.
     * @param {number} collectedBuckets - Cantidad de cubetas que el cliente entregará.
     * @param {number} deliveredBuckets - Cantidad de cubetas vacías solicitadas.
     * @throws {Error} Cuando el método no es implementado por la clase hija.
     */
    async saveCollectionRequestFirstSection(
        requestId,
        wantsCollection,
        wantsExtraProducts,
        collectedBuckets,
        deliveredBuckets,
    ) {
        throw new Error("solicitudesRecIRepository no implementado");
    }

}