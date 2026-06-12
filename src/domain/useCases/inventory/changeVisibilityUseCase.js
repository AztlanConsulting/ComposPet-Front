/**
 * Caso de uso para modificar la visibilidad de un producto extra
 */
export class ChangeVisibilityUseCase {

    constructor(inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    async execute(productId, newStatus) {
        const result = await this.inventoryRepository.changeProductVisibility(productId, newStatus);
        return result;
    }
}