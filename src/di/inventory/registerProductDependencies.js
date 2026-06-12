import { InventoryApiClient } from '../../data/datasources/inventoryApiClient';
import { InventoryRepository } from '../../data/repositories/inventoryRepository';
import { RegisterProductUseCase } from '../../domain/useCases/registerProductUseCase';
import { UpdateProductUseCase } from '../../domain/useCases/inventory/updateProductUseCase';

const inventoryApiClient = new InventoryApiClient();
const inventoryRepository = new InventoryRepository(inventoryApiClient);

export const registerProductUseCase = new RegisterProductUseCase(inventoryRepository);
export const updateProductUseCase = new UpdateProductUseCase(inventoryRepository);