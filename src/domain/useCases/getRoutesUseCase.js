/**
 * Caso de uso para recuperar la lista de rutas disponibles
 * Actúa como intermediario entre el ViewModel y el repositorio,
 * aplicando la validación de presencia antes de delegar al repositorio.
 *
 * @see UpdateClientIRepository
 */

export class GetRoutesUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Crea una instancia del caso de uso para consultar las rutas
     *
     * @param {UpdateClientIRepository} collectionSummaryRepository - Implementación del repositorio para la edición del cliente
     */
    async execute() {
        return await this.repository.getRoutes();
    }
}