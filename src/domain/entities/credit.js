/**
 * Entidad de dominio que representa a una tarjeta de cliente.
 * Encapsula los datos de las tarjetas y expone métodos para consultar
 * su información sin exponer la lógica de manipulación al exterior.
 */

export class Credit{
    /**
     * @param {Object} params - Datos del cliente provenientes del repositorio.
     * @param {string} params.creditId - Identificador único de la tarjeta de cliente.
     * @param {string} params.clientId - Identificador único del cliente.
     * @param {number|null} params.balance - Identificador de la ruta asignada.
     */
    constructor({
        creditId,
        clientId,
        balance,
    }){
        this.creditId = creditId;
        this.clientId = clientId;
        this.balance = balance;
    }

    /**
     * Retorna el saldo de un cliente.
     *
     * @returns {num} saldo de un cliente.
     */
    getCreditBalance(){
        return this.balance;
    }
}