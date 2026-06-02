import { InventoryApiClient } from '../../data/datasources/inventoryApiClient';
import { InventoryRepository } from '../../data/repositories/inventoryRepository';

import {GetInventoryUseCase} from '../../domain/useCases/inventory/getInventoryUseCase';

const inventoryApiClient = new InventoryApiClient();
const inventoryRepository = new InventoryRepository(inventoryApiClient);

export const getInventoryUseCase = new GetInventoryUseCase(inventoryRepository);