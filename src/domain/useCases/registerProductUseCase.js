import { InventoryIRepository } from '../repositories/inventoryInterfaceRepository';

/**
 * Caso de uso para registrar un nuevo producto en el inventario.
 * Actúa como intermediario entre el ViewModel y el repositorio,
 * validando la presencia de datos requeridos antes de delegar al repositorio.
 *
 * @see InventoryIRepository
 */
export class RegisterProductUseCase {
    /**
     * @param {InventoryIRepository} inventoryRepository
     * Implementación del repositorio de inventario.
     */
    constructor(inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    /**
     * Ejecuta la función para registrar un nuevo producto.
     *
     * @param {Object} productData - Datos del producto a registrar.
     * @param {string} productData.name - Nombre del producto.
     * @param {number} productData.price - Precio del producto.
     * @param {string|null} productData.description - Descripción del producto.
     * @param {number} productData.quantity - Cantidad disponible.
     * @param {string|null} productData.imageUrl - URL de la imagen del producto.
     * @param {string} productData.color - Color del producto.
     * @returns {Promise<import('../entities/inventoryProduct').InventoryProduct>} Producto registrado.
     * @throws {Error} Si falta algún dato requerido o si el repositorio falla.
     */
    async execute(productData) {
        if (
            !productData ||
            !productData.name ||
            productData.price === undefined ||
            productData.quantity === undefined ||
            !productData.color
        ) {
            throw new Error('Faltan datos requeridos para registrar el producto.');
        }

        const product = await this.inventoryRepository.registerProduct(productData);

        return product;
    }
}