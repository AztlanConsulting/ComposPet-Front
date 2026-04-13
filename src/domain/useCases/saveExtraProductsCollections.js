
/**
 * Use case for saving extra products in a collection request.
 * Acts as an intermediary between the ViewModel and the repository.
 */
export class SaveExtraProductsCollection {

    /**
     * @param {import('../repositories/solicitudesRecInterfaceRepository').SolicitudesRecIRepository} solicitudesRecRepository
     * - Implementation of the collection request repository.
     */
    constructor(solicitudesRecRepository) {
        this.solicitudesRecRepository = solicitudesRecRepository;
    }

    /**
     * Executes the saving of extra products for a collection request.
     *
     * @param {string} idSolicitud - UUID of the collection request.
     * @param {Array<{id_producto: number, cantidad: number}>} productos - List of products to save.
     * @returns {Promise<{message: string}>} Confirmation message.
     * @throws {Error} If an error occurs while saving the products.
     */
    async execute(idSolicitud, productos) {
        return await this.solicitudesRecRepository.guardarExtraProducts(idSolicitud, productos);
    }
}
