import '../../css/molecules/inventoryCard.css';
import Image from '../atoms/Image';

export default function InventoryCard({
    product,
    showImage = true,
    showPrice = true,
    showQuantity = true,
    responsiveCompact = true,
    variant = 'default',
    onClick,
}) {
    const {
        name = 'Producto sin nombre',
        price = 0,
        quantity = 0,
        color = '#00A99D',
        imageUrl,
    } = product || {};

    const colorMap = {
        verde: '#00A99D',
        amarillo: '#F4B400',
        naranja: '#F57C00',
        morado: '#6C2DFF',
        azul: '#4DB6E8',
        rosa: '#D96BC6',
        lila: '#A58BE8',
    };

    const getCardColor = (color) => {
        if (!color) return '#00A99D';
        if (color.startsWith('#')) return color;

        return colorMap[color.toLowerCase()] || '#00A99D';
    };

    const cardColor = getCardColor(color);

    const handleCardClick = () => {
        onClick?.(product);
    };

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
                    <span className={`inventory-card-price ${responsiveClass}`}>
                        ${Number(price).toFixed(2)}
                    </span>
                )}

                {showQuantity && (
                    <span className={`inventory-card-quantity ${responsiveClass}`}>
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