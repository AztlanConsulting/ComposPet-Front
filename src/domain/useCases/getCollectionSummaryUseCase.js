/**
 * Caso de uso para obtener el resumen de la  solicitud de recolección actual del cliente.
 * Actúa como intermediario entre el ViewModel y el repositorio,
 * aplicando la validación de presencia antes de delegar al repositorio.
 *
 * @see CollectionSummaryIRepository
 */

export class GetCollectionSummaryUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Crea una instancia del caso de uso para obtener el resumen de la solicitud.
     *
     * @param {CollectionSummaryIRepository} collectionSummaryRepository - Implementación del repositorio del resumen de la solicitud de recolección.
     */
    async execute(idClient, weekStartDate, weekEndDate) {
        return await this.repository.getSummary(
            idClient, 
            weekStartDate,
            weekEndDate
        );
    }
}