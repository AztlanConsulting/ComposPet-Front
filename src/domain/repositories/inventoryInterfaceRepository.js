 /**
 * Interfaz abstracta del repositorio de inventario.
 * Define el contrato que deben cumplir todas las implementaciones
 * del repositorio dentro de la capa de datos.
 *
 * Cualquier clase que extienda esta interfaz debe sobrescribir
 * los métodos definidos o lanzará un error.
 *
 * @abstract
 */
export class InventoryIRepository {

    /**
     * Registra un nuevo producto en el inventario.
     *
     * @abstract
     * @param {Object} productData - Datos del producto a registrar.
     * @param {string} productData.name - Nombre del producto.
     * @param {number} productData.price - Precio del producto.
     * @param {string|null} productData.description - Descripción del producto.
     * @param {number} productData.quantity - Cantidad disponible.
     * @param {string|null} productData.imageUrl - URL de la imagen del producto.
     * @param {string} productData.color - Color del producto.
     * @returns {Promise<InventoryProduct>} Producto registrado.
     * @throws {Error} Si el método no ha sido implementado.
     */
    async registerProduct(productData) {
        throw new Error('InventoryIRepository.registerProduct() not implemented');
    }

    /**
     * Obtiene la lista de productos disponibles en inventario.
     *
     * Este método debe ser implementado por cualquier repositorio
     * concreto que extienda esta interfaz.
     *
     * @abstract
     * @returns {Promise<InventoryProduct[]>} Lista de productos del inventario.
     * @throws {Error} Si el método no ha sido implementado.
     */
    async getInventory() {
        throw new Error('InventoryIRepository.getInventory() not implemented');
    }
}