import React from 'react'
import Card from 'react-bootstrap/Card';
import "../../css/molecules/productCard.css";
import Button from '../atoms/Button';

import Image from '../atoms/Image';

import Producto from '../../public/img/product.png';

export default function ProductCard() {
    return (
        <Card className='text-center product-card'>
            <div className='d-flex justify-content-center align-items-center image-back'>
                <Image src={Producto} alt='Foto de Producto' size='image-medium' variant='normal'></Image>
            </div>
            <Card.Body className='d-flex justify-content-center align-items-center flex-wrap product-card-body'>
                <Card.Title className='product-name'>Nombre del producto</Card.Title>
                <Card.Text className='m-1 product-description'>
                Descripción del producto
                </Card.Text>
                <Card.Text className='m-1 product-price'>
                Precio $$$
                </Card.Text>
                <Button size='small' type='accept' className='button'>Agregar</Button>
            </Card.Body>
        </Card>
    );
}
