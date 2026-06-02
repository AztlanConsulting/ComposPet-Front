import '../../css/molecules/inventoryModal.css';
import Icon from '../atoms/Icon';

const colorMap = {
    verde: '#00A99D',
    amarillo: '#F4B400',
    naranja: '#F57C00',
    morado: '#6C2DFF',
    azul: '#4DB6E8',
    rosa: '#D96BC6',
    lila: '#A58BE8',
};

const getProductColor = (color) => {
    if (!color) return '#00A99D';
    if (color.startsWith('#')) return color;

    return colorMap[color.toLowerCase()] || '#00A99D';
};

export default function InventoryModal({
    product,
    onClose,
    onEdit,
    onDelete,
    onToggleStatus,
}) {
    const modalColor = getProductColor(product.color);
    if (!product) return null;

    return (
        <div className="inventory-modal-overlay" onClick={onClose}>
            <div
                className="inventory-modal"
                style={{ borderColor: modalColor }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="inventory-modal-accent"
                    style={{ backgroundColor: modalColor }}
                />

                <button
                    type="button"
                    className="inventory-modal-close"
                    onClick={onClose}
                >
                    ×
                </button>

                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="inventory-modal-image"
                />

                <div className="inventory-modal-content">
                    <h3 className="inventory-modal-title">
                        {product.name}
                    </h3>

                    <p className="inventory-modal-description">
                        {product.description}
                    </p>

                    <p className="inventory-modal-price fw-bold">
                        ${Number(product.price).toFixed(2)}
                    </p>

                    <p className="inventory-modal-quantity bo">
                        {product.quantity} piezas
                    </p>

                    <div className="inventory-modal-actions">
                        {/* Cambiar los botones después */}
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
                </div>
            </div>
        </div>
    );
}