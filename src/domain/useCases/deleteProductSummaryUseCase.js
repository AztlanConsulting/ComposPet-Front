/**
 * Caso de uso para eliminar un producto de la lista de productos extra solicitados en el formulario de recolección
 * Actúa como intermediario entre el ViewModel y el repositorio,
 * aplicando la validación de presencia antes de delegar al repositorio.
 *
 * @see CollectionSummaryIRepository
 */

export class DeleteProductSummaryUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Crea una instancia del caso de uso para eliminar un producto.
     *
     * @param {CollectionSummaryIRepository} collectionSummaryRepository - Implementación del repositorio del resumen de la solicitud de recolección.
     */
    async execute(idProduct, idRequest) {
        return await this.repository.deleteProduct(idProduct, idRequest);
    }
}