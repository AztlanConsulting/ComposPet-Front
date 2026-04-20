/**
 * Entidad de dominio que representa a una tarjeta de cliente.
 * Encapsula los datos de las tarjetas y expone métodos para consultar
 * su información sin exponer la lógica de manipulación al exterior.
 */

export class Card{
    /**
     * @param {Object} params - Datos del cliente provenientes del repositorio.
     * @param {string} params.cardId - Identificador único de la tarjeta de cliente.
     * @param {string} params.clientId - Identificador único del cliente.
     * @param {string|null} params.levelId - Identificador único del nivel de tarjeta.
     * @param {number|null} params.balance - Identificador de la ruta asignada.
     */
    constructor({
        cardId,
        clientId,
        levelId,
        balance,
    }){
        this.cardId = cardId;
        this.clientId = clientId;
        this.levelId = levelId;
        this.balance = balance;
    }

    /**
     * Retorna el saldo de un cliente.
     *
     * @returns {num} saldo de un cliente.
     */
    getCardBalance(){
        return this.balance;
    }
}