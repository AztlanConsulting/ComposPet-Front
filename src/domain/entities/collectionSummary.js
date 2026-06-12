/**
 * Entidad de dominio que representa a los elementos necesarios
 * para recuperar los datos del resumen de una recolección
 */

export class CollectionSummary {

    /**
     * Crea una instancia de la entidad de solicitud de recolección.
     *
     * @param {Object} collection - Datos de la solicitud de recolección
     * @param {List} products - Lista de productos relacionados con la solicitud
     * @param {Int} balance - Saldo total del cliente
     * @param {Int} total - Total a pagar por la recolección
     * @param {List} payMethod - Lista de formas de pago disponibles
     */
    constructor(
        collection,
        products,
        balance,
        total,
        payMethods,
        bucketCost,
    ) {
        this.collection = collection;
        this.products = products;
        this.balance = balance;
        this.total = total;
        this.payMethods = payMethods;
        this.bucketCost = bucketCost;
    }

}