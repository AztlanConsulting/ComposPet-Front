/**
 * Caso de uso para actualizar la información del cliente.
 * Actúa como intermediario entre el ViewModel y el repositorio,
 * aplicando la validación de presencia antes de delegar al repositorio.
 *
 * @see UpdateClientIRepository
 * @see ClientInfo
 */

export class UpdateClientUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Crea una instancia del caso de uso para actualizar la información del cliente
     *
     * @param {UpdateClientIRepository} updateClientIRepository - Implementación del repositorio para la actualización de información del cliente.
     * @param {ClientInfo} updatedClient - Objeto con la información actualizada del cliente
    */
    async execute(updatedClient) {
        return await this.repository.updateClient(updatedClient);
    }
}