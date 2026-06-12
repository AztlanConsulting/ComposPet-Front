/**
 * Caso de uso para eliminar un producto extra
 */
export class DeleteProducUseCase {

    constructor(inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    async execute(productId) {
        const result = await this.inventoryRepository.deleteProduct(productId);
        return result;
    }
}