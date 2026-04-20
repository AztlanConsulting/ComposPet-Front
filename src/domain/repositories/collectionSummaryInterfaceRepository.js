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

    /**
     * Recibe el producto a eliminar de la solicitud de recolección
     *
     * @abstract
     * @param {string} idProduct - Id del producto.
     * @param {string} idRequest - Id de la solicitud asociada con el producto.
     * @throws {Error} Cuando el método no es implementado por la clase hija.
     */
    async deleteProduct(idProduct, idRequest){
        throw new Error("collectionSummaryIRepository no implementado");
    }

    /**
     * Recibe la información para el pago de la solicitud.
     *
     * @abstract
     * @param {string} idRequest - Id de la solicitud de recolección.
     * @param {Int} collectionTotal - Cantidad a pagar por la solicitud.
     * @param {Int} idPayment - Id del método de pago seleccionado por el cliente.
     * @throws {Error} Cuando el método no es implementado por la clase hija.
     */
    async updateCollectionTotal(idRequest, collectionTotal, idPayment){
        throw new Error("collectionSummaryIRepository no implementado");
    }

}