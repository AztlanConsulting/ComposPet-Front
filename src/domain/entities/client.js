/**
 * Entidad de dominio que representa a un cliente.
 * Encapsula los datos del cliente y expone métodos para consultar
 * su información sin exponer la lógica de manipulación al exterior.
 */
export class Client {
    /**
     * @param {Object} params - Datos del cliente provenientes del repositorio.
     * @param {string} params.clientId - Identificador único del cliente.
     * @param {string} params.userId - Identificador único del usuario asociado.
     * @param {number|null} params.routeId - Identificador de la ruta asignada.
     * @param {string} params.routeDay - día de ruta del cliente
     */
    constructor({
        clientId,
        routeId,
        name,
        routeDay,
    }) {
        this.clientId = clientId;
        this.routeId = routeId;
        this.name = name;
        this.routeDay = routeDay;
    }
    
    /**
     * Retorna el identificador único del cliente.
     *
     * @returns {string} Id del cliente.
     */
    getClientId() {
        return this.clientId;
    }

    /**
     * Retorna el día de ruta asignado al cliente.
     *
     * @returns {string|null} Día de ruta.
     */
    getRouteDay() {
        return this.routeDay;
    }

    /**
     * Retorna el nombre del cliente.
     *
     * @returns {string} Nombre del cliente.
     */
    getName() {
        return this.name;
    }
}