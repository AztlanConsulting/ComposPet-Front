import React from 'react'
import Card from 'react-bootstrap/Card';
import "../../css/molecules/summaryProductCard.css";
import Button from '../atoms/Button';
import Image from '../atoms/Image';
import Producto from '../../public/img/product.png';

/**
 * Tarjeta de presentación de un producto seleccionado en la solicitud.
 * Muestra la imagen, nombre, cantidad y precio total,
 * junto con un botón para eliminarlo de la solicitud.
 *
 *
 * @returns {JSX.Element} Tarjeta visual del producto con imagen, detalles y acción.
 */
export default function SummaryProductCard({
    product,
    cuantity,
    productTotal,
    onDelete,
}) {
    return (
        <div className="summary-product-card">

            {/* Imagen Producto */}
            <div className="summary-product-card-image">
                <img
                    src={product.imagen || Producto}
                    alt={product.nombre}
                    className="summary-product-card-img"
                />
            </div>

            {/* Información */}
            <div className="summary-product-card-content">

                <div className="summary-product-card-left">
                    <h4 className="summary-product-card-name">
                        {product.nombre}
                    </h4>

                    <p className="summary-product-card-quantity">
                        Cantidad: {cuantity}
                    </p>
                </div>

                <div className="summary-product-card-right">
                    <span className="summary-product-card-price">
                        Precio ${productTotal}
                    </span>

                    <Button
                        type="button"
                        size="small"
                        csstype="warning"
                        onClick={onDelete}
                    >
                        Eliminar
                    </Button>
                </div>

            </div>

        </div>
    );
}