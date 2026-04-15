/**
 * Interfaz abstracta del repositorio de clientes
 * Define el contrato que deben cumplir todas las implementaciones
 * del repositorio dentro de la capa de datos.
 *
 * Cualquier clase que extienda esta interfaz debe sobrescribir
 * los metodos definidos si no dara error
 *
 * @abstract
 */

export class ClientIRepository{
    /**
     * Obtiene el cliente asociado al id de usuario.
     *
     * @abstract
     * @param {string} userId - Id del usuario.
     * @returns {Promise<Client|null>} Objeto con el cliente o `null` si no existe.
     * @throws {Error} Si el método no ha sido implementado.
     */

    async getClientByUserId(userId) {
        throw new Error('ClientIRepository.getClientByUserId() not implemented');
    }
}