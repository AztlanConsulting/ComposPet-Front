/**
 * Entidad del dominio que representa el resultado del registro de un nuevo cliente.
 * Encapsula los datos retornados por la API tras completar el flujo de registro.
 */
export class NewClient {
    /**
     * @param {Object} params - Parámetros de construcción de la entidad.
     * @param {number} params.userId - Identificador del usuario creado en el sistema.
     * @param {number} params.clientId - Identificador del cliente creado en el sistema.
     * @param {string} params.email - Correo electrónico asignado al nuevo usuario.
     * @param {number} params.credit - Saldo de crédito inicial asignado al cliente.
     */
    constructor({
        userId,
        clientId,
        email,
        credit
    }) {
        this.userId = userId;
        this.clientId = clientId;
        this.email = email;
        this.credit = credit;
    }
}