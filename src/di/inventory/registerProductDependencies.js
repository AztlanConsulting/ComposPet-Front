import { InventoryApiClient } from '../../data/datasources/inventoryApiClient';
import { InventoryRepository } from '../../data/repositories/inventoryRepository';
import { RegisterProductUseCase } from '../../domain/useCases/registerProductUseCase';

const inventoryApiClient = new InventoryApiClient();
const inventoryRepository = new InventoryRepository(inventoryApiClient);

export const registerProductUseCase = new RegisterProductUseCase(inventoryRepository);