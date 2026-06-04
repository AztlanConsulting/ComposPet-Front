/**
 * Caso de uso para obtener la información del cliente
 * Actúa como intermediario entre el ViewModel y el repositorio,
 * aplicando la validación de presencia antes de delegar al repositorio.
 *
 * @see ClientIRepository
 */

export class GetClientTableUseCase {
    /**
     * Crea una instancia del caso de uso para obtener la información del cliente.
     *
     * @param {import('../repositories/clientTableInterfaceRepository').ClientTableIRepository} clientTableRepository - Implementación del repositorio de clientes.
     */

    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }

    /**
     * Ejecuta la obtención de la tabla de clientes
     *
     * @async
     * @returns {Promise<List<import('../entities/clientInfo').ClientInfo>>} Lista con las entidades ClienteInfo
     */
    async execute() {

        //Llama a el Repositorio de Interface
        const clientList = await this.clientRepository.getClientTable();
        return clientList;
    }
}