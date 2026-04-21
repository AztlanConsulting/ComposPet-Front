/**
 * Caso de uso para actualizar el total a pagar de una solicitud de recoleción y añadir el método de pago.
 * Actúa como intermediario entre el ViewModel y el repositorio,
 * aplicando la validación de presencia antes de delegar al repositorio.
 *
 * @see CollectionSummaryIRepository
 */

export class UpdateCollectionTotalUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Crea una instancia del caso de uso para actualizar el pago de la solicitud.
     *
     * @param {CollectionSummaryIRepository} collectionSummaryRepository - Implementación del repositorio del resumen de la solicitud de recolección.
     */
    async execute(idRequest, collectionTotal, idPayment, notes) {
        return await this.repository.updateCollectionTotal(idRequest, collectionTotal, idPayment, notes);
    }
}