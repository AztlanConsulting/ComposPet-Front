import '../../css/molecules/inventoryModal.css';
import Icon from '../atoms/Icon';
import formatCurrency from '../../utilities/formatCurrency';
import getProductImageUrl from '../../utilities/getProductImageUrl';
/**
 * Modal para mostrar detalles de un producto en el inventario.
 *
 * @param {Object} product - Objeto con los datos del producto
 * @param {Function} onClose - Callback para cerrar el modal
 * @param {Function} onEdit - Callback para editar el producto
 * @param {Function} onDelete - Callback para eliminar el producto
 * @param {Function} onToggleStatus - Callback para cambiar el estado del producto
 * @returns {JSX.Element}
 */
export default function InventoryModal({
    product,
    onClose,
    onEdit,
    onDelete,
    onToggleStatus,
}) {
    // si no hay producto, no renderiza el modal
    if (!product) return null;

    // Mapeo de colores predefinidos a códigos hexadecimales
    const colorMap = {
        verde: '#00A99D',
        amarillo: '#F4B400',
        naranja: '#F57C00',
        morado: '#6C2DFF',
        azul: '#4DB6E8',
        rosa: '#D96BC6',
        lila: '#A58BE8',
    };

    // Función para obtener el color del producto,
    // acepta nombres de colores o códigos hexadecimales
    const getProductColor = (color) => {
        if (!color) return '#00A99D';
        if (color.startsWith('#')) return color;

        return colorMap[color.toLowerCase()] || '#00A99D';
    };


    const getQuantityColor = (quantity) => {
        if (quantity < 0) return 'text-danger';
        return '';
    }


    // Obtiene el color para el borde y acento del modal
    const modalColor = getProductColor(product.color);
    const imageUrl = getProductImageUrl(product.imageUrl);

    return (
        <div className="inventory-modal-overlay" onClick={onClose}>
            <div
                className="inventory-modal"
                style={{ borderColor: modalColor }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Acento de color en el borde del modal */}
                <div
                    className="inventory-modal-accent"
                    style={{ backgroundColor: modalColor }}
                />

                {/* Botón de cierre */}
                <button
                    type="button"
                    className="inventory-modal-close"
                    onClick={onClose}
                >
                    ×
                </button>

                {/* Imagen del producto */}
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="inventory-modal-image"
                />

                {/* Contenido del modal */}
                <div className="inventory-modal-content">
                    <p className="inventory-modal-title">
                        {product.name}
                    </p>

                    <p className="inventory-modal-description">
                        {product.description}
                    </p>

                    <p className="inventory-modal-price fw-bold">
                        {formatCurrency(Number(product.price))}
                    </p>

                    <p className={getQuantityColor(product.quantity)}>
                        {product.quantity.toLocaleString('en-US')} piezas
                    </p>

                    {/* <div className="inventory-modal-actions">
                        <button onClick={() => onToggleStatus?.(product)}>
                            <Icon name="eyeClosed" />
                        </button>

                        <button onClick={() => onDelete?.(product)}>
                            <Icon name="trash" size="small"/>
                        </button>

                        <button onClick={() => onEdit?.(product)}>
                             <Icon name="edit" size="small"/>
                        </button>
                    </div>
                     */}
                </div>
            </div>
        </div>
    );
}