/**
 * Interfaz abstracta del repositorio de tarjetas de clientes
 * Define el contrato que deben cumplir todas las implementaciones
 * del repositorio dentro de la capa de datos.
 *
 * Cualquier clase que extienda esta interfaz debe sobrescribir
 * los metodos definidos si no dara error
 *
 * @abstract
 */

export class CreditIRepository{
    /**
     * Obtiene el saldo de un cliente con su id.
     *
     * @abstract
     * @param {string} clientId - Id del cliente.
     * @returns {Promise<Client|null>} Objeto con el cliente o `null` si no existe.
     * @throws {Error} Si el método no ha sido implementado.
     */
    async getCreditBalance(clientId){
        throw new Error('CreditIRepository.getCreditBalance() not implemented')
    }

}