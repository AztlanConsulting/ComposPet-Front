/**
 * Entidad de dominio que representa a una forma de pago.
 * Encapsula los datos de las transferencias y expone métodos para consultar
 * su información sin exponer la lógica de manipulación al exterior.
 */

export class Payment{
    /**
     * @param {Object} params - Datos del cliente provenientes del repositorio.
     * @param {string} params.notes - información de la forma de pago.
     */
    constructor({
        notes
    }){
        this.notes = notes;
    }

    /**
     * Retorna la información de la forma de pago.
     *
     * @returns {string} información de la forma de pago.
     */
    getPaymentInfo(){
        return this.notes;
    }
}