/**
 * Caso de uso para guardar la primera sección del formulario de recolección.
 * Actúa como intermediario entre el ViewModel y el repositorio,
 * aplicando la validación de presencia antes de delegar al repositorio.
 *
 * @see CollectionRequestIRepository
 */
export class SaveCollectionRequestFirstSectionUseCase {
    /**
     * @param {import('../../domain/repositories/collectionRequestInterfaceRepository').CollectionRequestIRepository} collectionRequestRepository
     * Implementación del repositorio de solicitudes de recolección.
     */
    constructor(collectionRequestRepository) {
        this.collectionRequestRepository = collectionRequestRepository;
    }

    /**
     * Ejecuta la función de guardar la primera sección de la solicitud de recolección.
     *
     * @param {string} requestId - Id de la solicitud.
     * @param {boolean} wantsCollection - Indica si el cliente desea recolección.
     * @param {boolean} wantsExtraProducts - Indica si el cliente desea productos extra.
     * @param {number} collectedBuckets - Cantidad de cubetas vacías solicitadas.
     * @param {number} deliveredBuckets - Cantidad de cubetas que el cliente entregará.
     * @returns {Promise<import('../entities/collectionRequest').CollectionRequest>} Entidad de solicitud de recolección actualizada.
     * @throws {Error} Si falta algún dato requerido o si el repositorio falla.
     */
    async execute(
        requestId,
        wantsCollection,
        wantsExtraProducts,
        collectedBuckets,
        deliveredBuckets,
    ) {
        if (
            !requestId
            || wantsCollection === undefined
            || wantsExtraProducts === undefined
        ) {
            throw new Error('Faltan datos requeridos para guardar la primera sección de la solicitud.');
        }

        const collectionRequest = await this.collectionRequestRepository.saveCollectionRequestFirstSection(
            requestId,
            wantsCollection,
            wantsExtraProducts,
            collectedBuckets,
            deliveredBuckets,
        );

        return collectionRequest;
    }
}
