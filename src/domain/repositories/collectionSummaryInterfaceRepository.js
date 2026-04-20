/**
 * Interfaz abstracta del repositorio de resumen de recolección
 * Define el contrato que deben cumplir todas las implementaciones
 * del repositorio dentro de la capa de datos.
 *
 * @abstract
 */

export class CollectionSummaryIRepository {
    /**
     * Obtiene el resumen de la solicitud de recolección del cliente.
     *
     * @abstract
     * @param {string} clientId - Id del cliente.
     * @param {string} weekStartDate - Fecha inicial del rango semanal.
     * @param {string} weekEndDate - Fecha final del rango semanal.
     * @throws {Error} Cuando el método no es implementado por la clase hija.
     */

    async getSummary(idClient, weekStartDate, weekEndDate){
        throw new Error("collectionSummaryIRepository no implementado");
    }

}