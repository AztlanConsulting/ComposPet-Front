import '../../css/molecules/inventoryCard.css';
import Image from '../atoms/Image';

/**
 * Tarjeta de producto para el inventario.
 * Muestra imagen, precio y cantidad con un acento de color personalizable.
 *
 * @param {Object} product - Objeto con los datos del producto (name, price, quantity, color, imageUrl)
 * @param {boolean} showImage - Muestra u oculta la imagen del producto (default: true)
 * @param {boolean} showPrice - Muestra u oculta el precio (default: true)
 * @param {boolean} showQuantity - Muestra u oculta la cantidad (default: true)
 * @param {boolean} responsiveCompact - En móvil oculta imagen/precio/cantidad y muestra "Ver más" (default: true)
 * @param {string} variant - Variante visual de la tarjeta, ej: 'default' (default: 'default')
 * @param {Function} onClick - Callback al hacer clic en la tarjeta, recibe el objeto product
 * @returns {JSX.Element}
 */
export default function InventoryCard({
    product,
    showImage = true,
    showPrice = true,
    showQuantity = true,
    responsiveCompact = true,
    variant = 'default',
    onClick,
}) {
    // Valores por defecto
    const {
        name = 'Producto sin nombre',
        price = 0,
        quantity = 0,
        color = '#00A99D',
        imageUrl,
    } = product || {};

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

    // Función para obtener el color del producto, acepta nombres de colores
    // o códigos hexadecimales
    const getCardColor = (color) => {
        // Si no hay color, usa este por defecto
        if (!color) return '#00A99D';
        // si el color empieza con # se asume que es un código hexadecimal
        if (color.startsWith('#')) return color;
        // Mapea el color a su respectivo hexadecimal en caso de ser string.
        return colorMap[color.toLowerCase()] || '#00A99D';
    };
    // Obtiene el color final para mostrar en la tarjeta
    const cardColor = getCardColor(color);

    // Maneja el clic en la tarjeta
    const handleCardClick = () => {
        onClick?.(product);
    };

    // maneja el color dependiendo de la cantidad que tiene
    const getQuantityColor = (quantity) => {
        if (quantity < 0) return 'text-danger';
        return '';
    }

    // Clase para ocultar elementos en móvil si responsiveCompact es true
    const responsiveClass = responsiveCompact
        ? 'd-none d-md-block'
        : '';

    return (
        <div
            className={`
                inventory-card
                inventory-card-${variant}
                d-flex
                align-items-center
                position-relative
            `}
            style={{ borderColor: cardColor }}
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
        >
            <div
                className="inventory-card-accent"
                style={{ backgroundColor: cardColor }}
            />

            {/* Solo muestra la imagen si showImage es true y imageUrl está definida */}
            {showImage && imageUrl && (
                <Image
                    src={imageUrl}
                    alt={name}
                    size="small"
                    variant="square"
                    className={`inventory-card-image ${responsiveClass}`}
                />
            )}

            <div className="inventory-card-content d-flex flex-column gap-1 flex-grow-1">
                <span className="inventory-card-name">
                    {name}
                </span>

                {showPrice && (
                    <span className={`inventory-card-price ${responsiveClass} fw-bold`}>
                        ${Number(price).toFixed(2)}
                    </span>
                )}

                {showQuantity && (
                    <span className={`inventory-card-quantity ${responsiveClass} ${getQuantityColor(quantity)}`}>
                        {quantity} piezas
                    </span>
                )}

                {responsiveCompact && (
                    <span className="inventory-card-toggle-text d-md-none">
                        Ver más
                    </span>
                )}
            </div>
        </div>
    );
}