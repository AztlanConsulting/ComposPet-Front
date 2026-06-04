import React from 'react'
import Card from 'react-bootstrap/Card';
import "../../css/molecules/productCard.css";
import Button from '../atoms/Button';
import Image from '../atoms/Image';
import formatCurrency from '../../utilities/formatCurrency';

/**
 * Tarjeta de presentación de un producto.
 * Muestra la imagen, nombre, descripción y precio del producto,
 * junto con un botón para agregarlo (por ejemplo, al carrito).
 *
 * @remarks
 * Actualmente utiliza datos estáticos de ejemplo. Deberá recibir
 * props con la información real del producto cuando se integre con
 * la fuente de datos correspondiente.
 *
 * @returns {JSX.Element} Tarjeta visual del producto con imagen, detalles y acción.
 */
export default function ProductCard({
    imageUrl = "",
    name = "",
    description = "",
    price = 0,
    cantidad = 0,
    onClickAgregar = () => {},
    onClickEliminar = () => {},
    onQuantityChange = () => {},
    maxQuantity = 999,
    agotado = false
}) {

    const handleQuantityChange = (event) => {
        const inputValue = event.target.value;

        // eliminar todo lo que no sea dígito
        const onlyNumbers = inputValue.replace(/\D/g, '');

        if (onlyNumbers === '') {
            onQuantityChange('');
            return;
        }

        const numericValue = parseInt(onlyNumbers, 10);

        if (Number.isNaN(numericValue)) {
            return;
        }

        const limitedValue = Math.min(Math.max(numericValue, 0), maxQuantity);

        onQuantityChange(limitedValue);
    };

    const handleQuantityBlur = () => {
        if (cantidad === '') {
            onQuantityChange(0);
        }
    };

    return (
        <Card className='product-card justify-content-center align-items-center'>
            {/* {agotado && (
                <p className="product-agotado">Haz alcanzado el máximo de {name}</p>
            )} */}
            <div className='d-flex justify-content-center align-items-center image-back'>
                <Image src={imageUrl} alt={name} size='image-medium' variant='normal'></Image>
            </div>
            <Card.Body className='d-flex justify-content-center align-items-center flex-wrap product-card-body'>
                <Card.Title className='product-name'>{name}</Card.Title>
                <Card.Text className='m-1 product-description'>
                {description}
                </Card.Text>
                <Card.Text className='m-1 product-price'>
                {price === "Sin costo" ? price : formatCurrency(price)}
                </Card.Text>
                <div className='buttons'>
                    <Button 
                        size='small' 
                        csstype='delete' 
                        className='buttonDelete' 
                        onClick={onClickEliminar} 
                        disabled={Number(cantidad || 0) === 0}
                        >
                        -
                    </Button>
                    
                    <input
                        type="text"
                        className="product-cantidad"
                        value={cantidad}
                        min="0"
                        max={maxQuantity}
                        onChange={handleQuantityChange}
                        onBlur={handleQuantityBlur}
                    />

                    <Button size='small' csstype='accept' className='buttonAdd' onClick={onClickAgregar} disabled={agotado}>
                        +
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}                                   