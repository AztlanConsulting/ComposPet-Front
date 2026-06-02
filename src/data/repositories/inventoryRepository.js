import { InventoryIRepository } from '../../domain/repositories/inventoryInterfaceRepository';
import { InventoryProduct } from '../../domain/entities/inventoryProduct';

/**
 * Implementación concreta del repositorio de inventario.
 * Actúa como adaptador entre el caso de uso y el cliente HTTP,
 * transformando la respuesta de la API en una entidad `InventoryProduct` del dominio.
 *
 * @extends InventoryIRepository
 * @see InventoryApiClient
 * @see InventoryProduct
 */
export class InventoryRepository extends InventoryIRepository {

    /**
     * Crea una instancia del repositorio de inventario.
     *
     * @param {import('../datasources/inventoryApiClient').InventoryApiClient} apiClient - Cliente HTTP que realiza las peticiones al servidor del módulo de inventario.
     */
    constructor(apiClient) {
        super();
        this.apiClient = apiClient;
    }

    /**
     * Registra un nuevo producto en el inventario.
     *
     * @async
     * @param {Object} productData - Datos del producto a registrar.
     * @returns {Promise<InventoryProduct>} Entidad `InventoryProduct` con la información registrada.
     * @throws {Error} Si la respuesta no contiene un producto válido.
     */
    async registerProduct(productData) {
        const data = await this.apiClient.registerProduct(productData);

        if (!data) {
            throw new Error('No se recibió información del producto registrado.');
        }

        return new InventoryProduct({
            productId: data.productId,
            name: data.name,
            price: data.price,
            quantity: data.quantity,
            color: data.color,
            status: data.status,
            deleted: data.deleted,
        });
    }
}