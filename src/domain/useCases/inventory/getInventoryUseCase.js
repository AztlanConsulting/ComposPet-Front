/**
 * Use case for retrieving the latest collection request of a client.
 */
export class GetInventoryUseCase {

    constructor(inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    async execute() {
        const result = await this.inventoryRepository.getInventory();
        return result;
    }
}