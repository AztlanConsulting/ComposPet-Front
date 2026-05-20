/**
 * Caso de uso para obtener la información básica del cliente
 * y su ruta asignada.
 *
 * Actúa como intermediario entre el ViewModel y el repositorio,
 * aplicando la validación de presencia antes de delegar al repositorio.
 *
 * @see ClientIRepository
 */

export class GetClientUseCase {
    /**
     * Crea una instancia del caso de uso para obtener el cliente.
     *
     * @param {import('../repositories/clientInterfaceRepository').ClientIRepository} clientRepository - Implementación del repositorio de clientes.
     */

    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }

    /**
     * Ejecuta la obtención básica del cliente asociado al id del usuario, 
     * Incluyendo el dia de ruta
     *
     * @async
     * @param {string} userId - Id del usuario.
     * @returns {Promise<import('../entities/client').Client>} Entidad `Client` encontrada.
     * @throws {Error} Si falta el id del usuario o si el repositorio falla.
     */
    async execute(userId) {
        if (!userId) {
            throw new Error("Falta el id del usuario");
        }

        //Llama a el Repositorio de Interface
        const client = await this.clientRepository.getClientByUserId(userId);
        return client;
    }
}