import { InventoryIRepository } from "../../repositories/inventoryInterfaceRepository";

/**
 * Caso de uso para modificar un producto del inventario.
 * Actúa como intermediario entre el ViewModel y el repositorio,
 * validando que se proporcione el ID del producto y al menos un campo a modificar.
 *
 * @see InventoryIRepository
 */
export class UpdateProductUseCase {
    /**
     * @param {InventoryIRepository} inventoryRepository
     * Implementación del repositorio de inventario.
     */
    constructor(inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    /**
     * Ejecuta la función para modificar un producto existente.
     *
     * @param {number} productId - ID del producto a modificar.
     * @param {Object} productData - Campos a actualizar (al menos uno requerido).
     * @param {string} [productData.name] - Nuevo nombre del producto.
     * @param {number} [productData.price] - Nuevo precio del producto.
     * @param {string} [productData.description] - Nueva descripción del producto.
     * @param {number} [productData.quantity] - Nueva cantidad disponible.
     * @param {string} [productData.color] - Nuevo color del producto.
     * @param {File}   [productData.imageFile] - Nueva imagen del producto.
     * @returns {Promise<Object>} Respuesta de éxito del servidor.
     * @throws {Error} Si falta el ID o si no se envió ningún campo a modificar.
     */
    async execute(productId, productData) {
        if (!productId) {
            throw new Error('El ID del producto es requerido para modificarlo.');
        }

        const UPDATABLE_FIELDS = ['name', 'price', 'description', 'quantity', 'color', 'imageFile'];
        const hasAtLeastOneField = UPDATABLE_FIELDS.some(
            field => productData?.[field] !== undefined
        );

        if (!hasAtLeastOneField) {
            throw new Error('Se debe proporcionar al menos un campo para modificar el producto.');
        }

        return await this.inventoryRepository.updateProduct(productId, productData);
    }
}