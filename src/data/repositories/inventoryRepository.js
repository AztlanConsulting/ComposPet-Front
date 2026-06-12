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

    /**
     * Obtiene los productos del inventario desde el API
     * y transforma la respuesta en entidades de dominio.
     *
     * @returns {Promise<InventoryProduct[]>} Lista de productos del inventario.
     * @throws {Error} Si la respuesta del API no contiene información válida.
     */
    async getInventory() {
         // Obtiene la información de productos desde el cliente API
        const response = await this.apiClient.getExtraProducts();

        // Valida que la respuesta exista y contenga
        // una lista válida de productos
        if (!response || !Array.isArray(response.data)) {
            throw new Error('No se recibió información válida del inventario.');
        }

        // Convierte los datos recibidos del API en
        // entidades InventoryProduct para mantener
        // consistencia dentro de la capa de dominio
        return response.data.map(item => {
            return new InventoryProduct({
                productId: item.productId,
                name: item.name,
                price: item.price,
                description: item.description,
                quantity: item.quantity,
                color: item.color,
                status: item.status,
                imageUrl: item.imageUrl,
            });
        });
    }

    /**
     * Modifica la visibilidad de un producto extra.
     * @param {INT} productId - Id del producto a modificar.
     * @param {BOOL} newStatus - Nuevo estatus del produco extra.
     * @returns {Promise<Object>} success.
     */
    async changeProductVisibility(productId, newStatus) {
        const response = await this.apiClient.changeProductVisibility(productId, newStatus);
        return response;
    }

    /**
     * Elimina un producto extra.
     * @param {INT} productId - Id del producto a eliminar.
     * @returns {Promise<Object>} success.
     */
    async deleteProduct(productId) {
        const response = await this.apiClient.deleteProduct(productId);
        return response;
    }
}