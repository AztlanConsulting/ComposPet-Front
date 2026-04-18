/**
 * Entidad de dominio que representa un producto extra.
 * Encapsula la información del producto obtenida desde el repositorio.
 */
export class ExtraProductRequest {
    /**
     * @param {object} params - Datos del producto extra provenientes del repositorio.
     * @param {number} params.idProducto - Identificador único del producto.
     * @param {number} params.cantidad - Cantidad disponible en inventario.
     */
    constructor({
        idProduct,
        quantity,
    }) {
        this.idProduct = idProduct;
        this.quantity = quantity;
    }
}