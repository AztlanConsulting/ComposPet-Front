/**
 * Entidad de dominio que representa a una solicitud de recolección.
 * Encapsula los datos de la solicitud y expone métodos para consultar
 * su información sin exponer la lógica de manipulación al exterior.
 */

export class CollectionRequest {

    /**
     * Crea una instancia de la entidad de solicitud de recolección.
     *
     * @param {Object} params - Datos de la solicitud provenientes del repositorio.
     * @param {string} params.id - Id único de la solicitud.
     * @param {string} params.clientId - Id único del cliente.
     * @param {number} params.deliveredBuckets - Cantidad de cubetas vacías solicitadas.
     * @param {number} params.collectedBuckets - Cantidad de cubetas entregadas por el cliente.
     * @param {number} params.totalToPay - Total a pagar asociado a la solicitud.
     * @param {number} params.totalPaid - Total pagado asociado a la solicitud.
     * @param {string|Date} params.date - Fecha de la solicitud.
     * @param {string|Date} params.schedule - Horario asociado a la solicitud.
     * @param {string} params.notes - Notas adicionales de la solicitud.
     * @param {boolean} params.wantsCollection - Indica si el cliente desea recolección.
     * @param {boolean} params.wantsExtraProducts - Indica si el cliente desea productos extra.
     * @param {number} params.paymentId - Id de la forma de pago asociada.
     */
    constructor({
        id,
        clientId,
        deliveredBuckets,
        collectedBuckets,
        totalToPay,
        totalPaid,
        date,
        schedule,
        notes,
        wantsCollection,
        wantsExtraProducts,
        paymentId,
    }) {
        this.id = id;
        this.clientId = clientId;
        this.deliveredBuckets = deliveredBuckets;
        this.collectedBuckets = collectedBuckets;
        this.totalToPay = totalToPay;
        this.totalPaid = totalPaid;
        this.date = date;
        this.schedule = schedule;
        this.notes = notes;
        this.wantsCollection = wantsCollection;
        this.wantsExtraProducts = wantsExtraProducts;
        this.paymentId = paymentId;
    }

    /**
     * Indica si el cliente desea recolección.
     *
     * @returns {boolean} `true` si el cliente desea recolección.
     */
    wantsPickup() {
        return this.wantsCollection === true;
    }

    /**
     * Indica si el cliente desea productos extra.
     *
     * @returns {boolean} `true` si el cliente desea productos extra.
     */
    wantsAdditionalProducts() {
        return this.wantsExtraProducts === true;
    }

    /**
     * Retorna la cantidad de cubetas que el cliente entregará.
     *
     * @returns {number} Cantidad de cubetas que el cliente entregará.
     */
    getCollectedBuckets() {
        return this.collectedBuckets;
    }

    /**
     * Retorna la cantidad de cubetas vacías solicitadas por el cliente.
     *
     * @returns {number} Cantidad de cubetas vacías solicitadas por el cliente.
     */
    getDeliveredBuckets() {
        return this.deliveredBuckets;
    }

}