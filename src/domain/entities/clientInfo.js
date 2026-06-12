/**
 * Entidad de dominio que representa a la información de un cliente para la tabla del administrador
 * Encapsula los datos del cliente
 */
export class ClientInfo {
    /**
     * @param {Object} params - Datos del cliente provenientes del repositorio.
     * @param {string} params.clientId - Id del cliente
     * @param {string} params.userId - Id del usuario asociado al cliente
     * @param {Int} params.pets - Número de mascotas del cliente
     * @param {string} params.familySize - Descripción de la familia del cliente
     * @param {string} params.address - Dirección del cliente
     * @param {string} params.notes - Notas relacionadas al cliente
     * @param {string} params.name - Nombre y apellidos del cliente
     * @param {string} params.cellphone - Teléfono del usuario
     * @param {Int} params.balance - Saldo del cliente
     * @param {string} params.lastRequest - Fecha (String) de la última recolección del cliente
     * @param {string} params.routeId - Id de la ruta asociada al cliente
     * @param {string} params.route - Ruta a la que el cliente es parte
     * @param {string} params.status - Usuario Activo / Inactivo
     */
    constructor({
        clientId,
        userId,
        pets,
        family,
        address,
        notes,
        name,
        cellphone,
        balance,
        lastRequest,
        routeId,
        route,
        status,
        order,
        email,
        priceType,
    }) {
        this.clientId = clientId;
        this.userId = userId;
        this.pets = pets;
        this.family = family;
        this.address = address;
        this.notes = notes;
        this.name = name;
        this.cellphone = cellphone;
        this.balance = balance;
        this.lastRequest = lastRequest;
        this.routeId = routeId;
        this.route = route;
        this.status = status;
        this.order = order;
        this.email = email;
        this.priceType = priceType;
    }
    
}