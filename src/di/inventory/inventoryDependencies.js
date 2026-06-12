// Cliente encargado de realizar las peticiones HTTP
// relacionadas con inventario
import { InventoryApiClient } from '../../data/datasources/inventoryApiClient';
// Repositorio encargado de abstraer el acceso a datos
// y transformar la información recibida
import { InventoryRepository } from '../../data/repositories/inventoryRepository';

// Caso de uso encargado de obtener la información
// del inventario desde la capa de dominio
import {GetInventoryUseCase} from '../../domain/useCases/inventory/getInventoryUseCase';
import { ChangeVisibilityUseCase } from '../../domain/useCases/inventory/changeVisibilityUseCase';
import { DeleteProductUseCase } from '../../domain/useCases/inventory/deleteProductUseCase';

// Inicializa el cliente API para consumir endpoints de inventario
const inventoryApiClient = new InventoryApiClient();

// Inyecta el cliente API dentro del repositorio para
// desacoplar la fuente de datos de la lógica de negocio
const inventoryRepository = new InventoryRepository(inventoryApiClient);

// Exporta una instancia lista para usar del caso de uso,
// inyectando las dependencias necesarias
export const getInventoryUseCase = new GetInventoryUseCase(inventoryRepository);
export const changeVisibilityUseCase = new ChangeVisibilityUseCase(inventoryRepository);
export const deleteProductUseCase = new DeleteProductUseCase(inventoryRepository);