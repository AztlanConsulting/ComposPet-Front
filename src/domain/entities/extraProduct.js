/**
 * Entidad de dominio que representa un producto extra.
 * Encapsula la información del producto obtenida desde el repositorio.
 */
export class ExtraProduct {
    /**
     * @param {object} params - Datos del producto extra provenientes del repositorio.
     * @param {number} params.idProducto - Identificador único del producto.
     * @param {string} params.nombre - Nombre del producto.
     * @param {number} params.precio - Precio del producto.
     * @param {string|null} params.descripcion - Descripción del producto.
     * @param {number} params.cantidad - Cantidad disponible en inventario.
     * @param {string|null} params.imagenUrl - URL o ruta de la imagen del producto.
     * @param {string} params.estatus - Estado del producto.
     */
    constructor({
        idProduct,
        name,
        price,
        description,
        quantity,
        imageUrl,
        status,
    }) {
        this.idProducto = idProduct;
        this.name = name;
        this.price = price;
        this.description = description;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
        this.status = status;
    }

    /**
     * Indica si el producto está activo.
     * @returns {boolean}
     */
    estaActivo() {
        return this.status === 'activo';
    }

    /**
     * Indica si hay stock disponible.
     * @returns {boolean}
     */
    tieneStock() {
        return this.quantity > 0;
    }

    /**
     * Retorna el precio del producto.
     * @returns {number}
     */
    obtenerPrecio() {
        return this.price;
    }

    /**
     * Retorna la ruta de la imagen del producto.
     * @returns {string|null}
     */
    obtenerImagenUrl() {
        return this.imageUrl;
    }
}