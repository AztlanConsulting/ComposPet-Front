import { UpdateClientIRepository } from '../../domain/repositories/updateClientInterfaceRepository';

/**
 * Implementación concreta del repositorio de actualización de información del cliente
 * Actúa como adaptador entre el caso de uso y el cliente HTTP
 *
 * @extends UpdateClientIRepository
 * @see ClientApiClient
 */

export class UpdateClientRepository extends UpdateClientIRepository {
    /**
     * Crea una instancia del repositorio.
     *
     * @param {import('../datasources/clientApiClient').ClientApiClient} apiClient 
     */

    constructor(apiClient){
        super();
        this.apiClient = apiClient
    }

    /**
     * Obtiene las rutas disponibles
     *
     * @async
     * @returns {Promise<List>} Lista de rutas disponibles.
     * @throws {Error}
     */
    async getRoutes() {
        const response = await this.apiClient.getRoutes();
        return response;
    }
}