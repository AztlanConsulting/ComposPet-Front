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
     * @param {string|null} params.pets - Información de mascotas del cliente.
     * @param {number|null} params.familySize - Cantidad de integrantes de la familia.
     * @param {string|null} params.address - Dirección registrada del cliente.
     * @param {number|null} params.scheduleOrder - Orden del horario asignado.
     * @param {string|null} params.notes - Notas adicionales del cliente.
     * @param {string|Date|null} params.entryDate - Fecha de entrada del cliente.
     * @param {string|Date|null} params.exitDate - Fecha de salida del cliente.
     */
    constructor({
        clientId,
        userId,
        routeId,
        pets,
        familySize,
        address,
        scheduleOrder,
        notes,
        entryDate,
        exitDate,
    }) {
        this.clientId = clientId;
        this.userId = userId;
        this.routeId = routeId;
        this.pets = pets;
        this.familySize = familySize;
        this.address = address;
        this.scheduleOrder = scheduleOrder;
        this.notes = notes;
        this.entryDate = entryDate;
        this.exitDate = exitDate;
    }
    
    /**
     * Retorna el identificador único del cliente.
     *
     * @returns {string} Id del cliente.
     */
    getClientId() {
        return this.clientId;
    }
}