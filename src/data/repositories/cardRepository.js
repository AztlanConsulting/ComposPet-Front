import {CardIRepository} from '../../domain/repositories/cardInterfaceRepository'
import {Card} from '../../domain/entities/card';

/**
 * Implementación concreta del repositorio de tarjetas.
 * Actúa como adaptador entre el caso de uso y el cliente HTTP,
 * transformando la respuesta de la API en una entidad `Card` del dominio.
 *
 * @extends CardIRepository
 * @see CardApiClient
 * @see Card
 */

export class CardRepository extends CardIRepository {
    /**
     * Crea una instancia del repositorio de tarjetas.
     *
     * @param {import('../datasources/cardApiClient').CardApiClient} apiClient - Cliente HTTP que realiza las peticiones al servidor del módulo de tarjetas.
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
    async getCardBalance(clientId) {
        const response = await this.apiClient.getCardBalance(clientId);

        //Para acceder al body
        const data = response.data;

        return new Card({
            cardId: data.id_tarjeta,
            clientId: data.id_cliente,
            levelId: data.id_nivel,
            balance: data.saldo,
        });
    }
}