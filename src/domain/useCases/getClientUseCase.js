/**
 * Caso de uso para obtener la id del cliente.
 * Actúa como intermediario entre el ViewModel y el repositorio,
 * aplicando la validación de presencia antes de delegar al repositorio.
 *
 * @see ClientIRepository
 */

export class GetClientUseCase {
    /**
     * @param {import('../repositories/clientInterfaceRepository').ClientIRepository} clientRepository
     * Implementación del repositorio de clientes.
     */

    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }

    /**
     * Ejecuta la obtención del cliente asociado al id del usuario.
     *
     * @async
     * @param {string} idUsuario - Id del usuario 
     * @returns {Promise<import('../entities/client').Client>} Entidad `Client` encontrada.
     * @throws {Error} Si falta el id del usuario o si el repositorio falla.
     */

    async execute(idUsuario) {
        if (!idUsuario) {
            throw new Error("Falta el id del usuario");
        }

        const client = await this.clientRepository.obtenerClientePorIdUsuario(idUsuario);
        return client;
    }
}