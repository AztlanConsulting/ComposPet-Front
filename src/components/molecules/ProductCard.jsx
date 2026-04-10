import React from 'react'
import Card from 'react-bootstrap/Card';
import "../../css/molecules/productCard.css";
import Button from '../atoms/Button';
import Image from '../atoms/Image';
import Producto from '../../public/img/product.png';

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
    onClick = () => {},
}) {
    return (
        <Card className='text-center product-card'>
            <div className='d-flex justify-content-center align-items-center image-back'>
                <Image src={imageUrl} alt={name} size='image-medium' variant='normal'></Image>
            </div>
            <Card.Body className='d-flex justify-content-center align-items-center flex-wrap product-card-body'>
                <Card.Title className='product-name'>{name}</Card.Title>
                <Card.Text className='m-1 product-description'>
                {description}
                </Card.Text>
                <Card.Text className='m-1 product-price'>
                Precio: ${price.toFixed(2)}
                </Card.Text>
                <Button size='small' csstype='accept' className='button' onClick={onClick}>
                    Agregar
                </Button>
            </Card.Body>
        </Card>
    );
}                                   