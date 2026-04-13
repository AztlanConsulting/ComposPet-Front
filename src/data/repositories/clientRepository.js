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
     * @param {import('../datasources/clientApiClient').ClientApiClient} apiClient
     * Cliente HTTP que realiza las peticiones al servidor del módulo de clientes.
     */

    constructor(apiClient){
        super();
        this.apiClient = apiClient;
    }

    /**
     * Obtiene el cliente asociado al id del usuario proporcionado.
     *
     * @async
     * @param {string} idUsuario - Id del usuario 
     * @returns {Promise<Client>} Entidad `Cliente` con la información recuperada.
     * @throws {Error} Si la respuesta no contiene un cliente válido.
     */

    async obtenerClientePorIdUsuario(idUsuario) {
        const response = await this.apiClient.obtenerClientePorIdUsuario(idUsuario);

        //Importante para acceder a el cuerpo de la respuesta
        const data = response.data;

        return new Client({
            idCliente: data.id_cliente,
            idUsuario: data.id_usuario,
            idRuta: data.id_ruta,
            mascotas: data.mascotas,
            cantidadFamilia: data.cantidad_familia,
            direccion: data.direccion,
            ordenHorario: data.orden_horario,
            notas: data.notas,
            fechaEntrada: data.fecha_entrada,
            fechaSalida: data.fecha_salida,
        });
    }
}