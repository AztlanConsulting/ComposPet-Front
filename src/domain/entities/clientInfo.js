/**
 * Entidad de dominio que representa a la información de un cliente para la tabla del administrador
 * Encapsula los datos del cliente
 */
export class ClientInfo {
    /**
     * @param {Object} params - Datos del cliente provenientes del repositorio.
     * @param {string} params.clientId - Id del cliente
     * @param {Int} params.pets - Número de mascotas del cliente
     * @param {Int} params.familySize - Número de familiares del cliente
     * @param {string} params.address - Dirección del cliente
     * @param {string} params.notes - Notas relacionadas al cliente
     * @param {string} params.name - Nombre y apellidos del cliente
     * @param {string} params.cellphone - Teléfono del usuario
     * @param {Int} params.balance - Saldo del cliente
     * @param {string} params.lastRequest - Fecha (String) de la última recolección del cliente
     * @param {string} params.zone - Zona de la que el cliente es parte
     */
    constructor({
        clientId,
        pets,
        familySize,
        address,
        notes,
        name,
        cellphone,
        balance,
        lastRequest,
        zone,
        status,
    }) {
        this.clientId = clientId;
        this.pets = pets;
        this.familySize = familySize;
        this.address = address;
        this.notes = notes;
        this.name = name;
        this.cellphone = cellphone;
        this.balance = balance;
        this.lastRequest = lastRequest;
        this.zone = zone;
        this.status = status;
    }
    
}