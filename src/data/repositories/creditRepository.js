import {CreditIRepository} from '../../domain/repositories/creditInterfaceRepository'
import {Credit} from '../../domain/entities/credit';

/**
 * Implementación concreta del repositorio de tarjetas.
 * Actúa como adaptador entre el caso de uso y el cliente HTTP,
 * transformando la respuesta de la API en una entidad `Credit` del dominio.
 *
 * @extends CreditIRepository
 * @see CreditApiClient
 * @see Credit
 */

export class CreditRepository extends CreditIRepository {
    /**
     * Crea una instancia del repositorio de tarjetas.
     *
     * @param {import('../datasources/creditApiClient').CreditApiClient} apiClient - Cliente HTTP que realiza las peticiones al servidor del módulo de tarjetas.
     */

    constructor(apiClient){
        super();
        this.apiClient = apiClient
    }

    /**
     * Obtiene el saldo de un cliente.
     *
     * @async
     * @param {string} userId - Id del usuario.
     * @returns {Promise<Client>} Entidad `Client` con la información recuperada.
     * @throws {Error} Si la respuesta no contiene un cliente válido.
     */
    async getCreditBalance(clientId) {
        const response = await this.apiClient.getCreditBalance(clientId);

        //Para acceder al body
        const data = response.data;

        return new Credit({
            creditId: data.id_saldo,
            clientId: data.id_cliente,
            balance: data.saldo,
        });
    }
}