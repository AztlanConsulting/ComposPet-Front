import { ClientTableIRepository } from "../../domain/repositories/clientTableInterfaceRepository";
import { ClientInfo } from "../../domain/entities/clientInfo";

/**
 * Implementación concreta del repositorio de clientTable
 * Actúa como adaptador entre el caso de uso y el cliente HTTP,
 * transformando la respuesta de la API en una entidad `ClientInfo` del dominio.
 *
 * @extends ClientTableIRepository
 * @see ClientApiClient
 * @see ClientInfo
 */
export class ClientTableRepository extends ClientTableIRepository{

    /**
     * @param {import('../datasources/clientApiClient').ClientApiClient} apiClient
     * - Cliente HTTP que realiza las peticiones al servidor de clientes.
     */

    constructor(apiClient){
        super();
        this.apiClient = apiClient;
    }

    /**
     * Autentica al usuario contra la API y retorna una entidad de dominio.
     * Mapea los campos de la respuesta del servidor a los atributos de `User`,
     * adaptando la nomenclatura de la API (snake_case) al dominio (camelCase).
     *
     * @param {string} correo - Correo electrónico del usuario.
     * @param {string} password - Contraseña del usuario.
     * @returns {Promise<User>} Instancia de `User` con los datos de sesión.
     * @throws {Error} Si el cliente HTTP falla o la API retorna un error.
     * @see AuthApiClient.login
     */

    async getClientTable(){
        const clients = await this.apiClient.getClientTable();

        let clientList = []

        for (const client of clients) {
            const  clientObject = new ClientInfo({
                clientId: client.clientId,
                userId: client.userId,
                pets: client.pets,
                family: client.family,
                address: client.address,
                notes: client.notes,
                name: client.name,
                cellphone: client.cellphone,
                balance: client.balance,
                lastRequest: client.lastRequest,
                routeId: client.routeId,
                route: client.route,
                status: client.status,
            });

            clientList.push(clientObject);
        }

        return clientList;
    }

}