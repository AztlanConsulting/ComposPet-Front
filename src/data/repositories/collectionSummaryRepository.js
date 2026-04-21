
import { CollectionSummary } from "../../domain/entities/collectionSummary";

/**
 * Implementación concreta del repositorio de resumen de la solicitud.
 * Actúa como adaptador entre el caso de uso y el cliente HTTP,
 * transformando la respuesta de la API en una entidad `CollectionSummary` del dominio.
 *
 * @extends CollectionSummaryIRepository
 * @see CollectionRequestApiClient
 * @see CollectionSummary
 */
export class CollectionSummaryRepositoryImpl {
    constructor(datasource) {
        this.datasource = datasource;

    }
    /**
     * Obtiene la información del resumen del formulario de recolección.
     *
     * @param {string} clientId - Id del cliente en formato UUID.
     * @param {string} weekStartDate - Fecha inicial del rango semanal.
     * @param {string} weekEndDate - Fecha final del rango semanal.
     * @returns {Promise<CollectionSummaryt>} Entidad de dominio con la solicitud encontrada.
     */
    async getSummary(idClient, weekStartDate, weekEndDate) {
        const response = await this.datasource.getSummary(
            idClient,
            weekStartDate,
            weekEndDate
        );

        return new CollectionSummary(
            response.data.collection,
            response.data.products,
            response.data.balance,
            response.data.collectionTotal,
            response.data.payMethods
        );
    }

    /**
     * Manda a eliminar un producto por su id
     *
     * @param {string} idProduct - Id del producto a eliminar.
     * @param {string} idRequest - Id de la recolección asociada al producto.
     * @returns {Promise}
     */
    async deleteProduct(idProduct, idRequest, quantity) {
        return await this.datasource.deleteProduct(idProduct, idRequest, quantity);
    }

    /**
     * Actualiza el total a pagar y la información de pago de la solicitud.
     *
     * @param {string} idRequest - Id de la solicitud a modificar.
     * @param {Int} collectionTotal - total a pagar por la recolección.
     * @param {Int} idPayment - Id del método de pago seleccionado.
     * @param {string} notes - Notas adicionales a la recolección.
     * @returns {Promise}
     */
    async updateCollectionTotal(idRequest, collectionTotal, idPayment, notes) {
        return await this.datasource.updateCollectionTotal(idRequest, collectionTotal, idPayment, notes);
    }
}