/**
 * Interfaz abstracta del repositorio de edición de cliente
 * Define el contrato que deben cumplir todas las implementaciones
 * del repositorio dentro de la capa de datos.
 *
 * Cualquier clase que extienda esta interfaz debe sobrescribir
 * los metodos definidos si no dara error
 *
 * @abstract
 */

export class UpdateClientIRepository{
    /**
     * Obtiene las rutas disponibles.
     *
     * @abstract
     * @returns {Promise<List|null>} Lista con las rutas o `null` si no existe.
     * @throws {Error} Si el método no ha sido implementado.
     */
    async getRoutes(){
        throw new Error('UpdateClientIRepository.getRoutes() not implemented')
    }

    /**
     * Obtiene las rutas disponibles.
     *
     * @abstract
     * @param {ClientInfo} updatedClient - Objeto del cliente con la información actualizada.
     * @returns {Promise} success.
     * @throws {Error} Si el método no ha sido implementado.
     */ 
    async updateClient(updatedClient){
        throw new Error('UpdateClientIRepository.updateClient not implemented')
    }

}