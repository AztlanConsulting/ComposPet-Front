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
     * Obtiene la información básica del cliente asociado al id de usuario,
     * incluyendo su ruta asignada.
     *
     * @abstract
     * @param {string} userId - Id del usuario.
     * @returns {Promise<Client|null>} Objeto con el cliente o `null` si no existe.
     * @throws {Error} Si el método no ha sido implementado.
     */

    //Llama al repositorio de data
    async getClientByUserId(userId) {
        throw new Error('ClientIRepository.getClientByUserId() not implemented');
    }

    async getCompostStatus(){
        throw new Error('ClientIRepository.getCompostStatus() not implemented');
    }

    async updateCompostStatus(newStatus){
        throw new Error('ClientIRepository.updateCompostStatus() not implemented');
    }

}