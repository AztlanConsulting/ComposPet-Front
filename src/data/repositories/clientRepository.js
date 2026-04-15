import {ClientIRepository} from '../../domain/repositories/clientInterfaceRepository';
import {Client} from '../../domain/entities/client';

/**
 * Implementación concreta del repositorio de clientes.
 * Actúa como adaptador entre el caso de uso y el cliente HTTP,
 * transformando la respuesta de la API en una entidad `Client` del dominio.
 *
 * @extends ClientIRepository
 * @see ClientApiClient
 * @see Client
 */

export class ClientRepository extends ClientIRepository{

    /**
     * Crea una instancia del repositorio de clientes.
     *
     * @param {import('../datasources/clientApiClient').ClientApiClient} apiClient - Cliente HTTP que realiza las peticiones al servidor del módulo de clientes.
     */
    constructor(apiClient){
        super();
        this.apiClient = apiClient;
    }

    /**
     * Obtiene el cliente asociado al id del usuario proporcionado.
     *
     * @async
     * @param {string} userId - Id del usuario.
     * @returns {Promise<Client>} Entidad `Client` con la información recuperada.
     * @throws {Error} Si la respuesta no contiene un cliente válido.
     */
    async getClientByUserId(userId) {
        const response = await this.apiClient.getClientByUserId(userId);

        //Importante para acceder a el cuerpo del backend
        const data = response.data;

        return new Client({
            clientId: data.id_cliente,
            userId: data.id_usuario,
            routeId: data.id_ruta,
            pets: data.mascotas,
            familySize: data.cantidad_familia,
            address: data.direccion,
            scheduleOrder: data.orden_horario,
            notes: data.notas,
            entryDate: data.fecha_entrada,
            exitDate: data.fecha_salida,
        });
    }
}