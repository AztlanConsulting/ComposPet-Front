/**
 * Use case for retrieving available extra products.
 * Acts as an intermediary between the ViewModel and the repository.
 */
export class ExtraProductsUseCase {

    /**
     * @param {import('../repositories/solicitudesRecInterfaceRepository').SolicitudesRecIRepository} solicitudesRecRepository
     * - Implementation of the collection request repository.
     */
    constructor(solicitudesRecRepository) {
        this.solicitudesRecRepository = solicitudesRecRepository;
    }

    /**
     * Executes the retrieval of available extra products.
     *
     * @returns {Promise<Array<import('../../domain/entities/ProductoExtra').ProductoExtra>>}
     * List of available extra products.
     * @throws {Error} If an error occurs while fetching the products.
     */
    async execute() {
        const products = await this.solicitudesRecRepository.getExtraProducts();
        return products;
    }
}