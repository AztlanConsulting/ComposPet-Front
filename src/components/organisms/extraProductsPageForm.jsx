import { useEffect, useState } from "react";
import CollectionRequestViewModel from "../../presentation/viewmodels/collectionRequest/collectionRequestViewModel";
import ProductCard from "../molecules/ProductCard";
import NavBar from "../molecules/Navbar";
import FormCard from "../Template/formCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../css/organisms/extraProductsPageForm.css';
import Loading from '../Template/loading';
import Button from '../atoms/Button';

function ExtraProductsView() {
    const {
        products,
        loading,
        error,
        loadExtraProducts, 
        saveExtraProducts,
        loadUltimaSolicitud,
    } = CollectionRequestViewModel();

    const [selectedProducts, setSelectedProducts] = useState(() => {
        const isLoggedIn = !!sessionStorage.getItem('token');
        
        // PROBAR ESTO
        if (!isLoggedIn) {
            sessionStorage.removeItem('selectedProducts');
            return {};
        }
        
        const saved = sessionStorage.getItem('selectedProducts');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        loadUltimaSolicitud();
        loadExtraProducts();
    }, []);

    useEffect(() => {
        sessionStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    }, [selectedProducts]);

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <p>{error}</p>;
    }

    const handleAgregar = (id, stockDisponible) => {
        setSelectedProducts(prev => {
            const cantidadActual = prev[id] || 0;

            return { ...prev, [id]: cantidadActual + 1 };
        });
    };

    const handleEliminar = (id) => {
        setSelectedProducts(prev => {
            const cantidadActual = prev[id] || 0;
            if (cantidadActual <= 1) {
                const { [id]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [id]: cantidadActual - 1 };
        });
    };

    const handleSiguiente = async () => {
        const idSolicitud = sessionStorage.getItem('idSolicitud');

        // Convierte el objeto {id: cantidad} a array [{id_producto, cantidad}]
        const productos = Object.entries(selectedProducts).map(([id, cantidad]) => ({
            id_producto: parseInt(id),
            cantidad,
        }));

        await saveExtraProducts(idSolicitud, productos);
        sessionStorage.removeItem('selectedProducts');
    };


    console.log("Seleccionados:", selectedProducts);

    const totalSeleccionados = Object.keys(selectedProducts).length;

    return (
        <div className="secondPage">
            <NavBar />
            <h1>Formulario de Recoleccion</h1>
            <FormCard className="extra-products-form-card">
                <h2>Productos Extra</h2>

                {totalSeleccionados >= 3 && (
                    <p className="limite-mensaje">Has alcanzado el límite de 3 productos adicionales.</p>
                )}
                {products.length === 0 ? (
                    <p>No extra products available.</p>
                ) : (
                    <Swiper
                        modules={[Navigation]}
                        navigation
                        slidesPerView={4}
                        spaceBetween={50}
                        breakpoints={{
                            320: { slidesPerView: 1 },   // móvil
                            600: { slidesPerView: 2 },   // tablet
                            900: { slidesPerView: 3 },   // tablet grande
                            1200: { slidesPerView: 4 },  // desktop
                        }}
                    >
                        {products.map((product) => (
                            //console.log("Producto renderizado:", product),
                            <SwiperSlide key={product.idProducto}>
                                <div className={`swiper-product-card ${totalSeleccionados >= 3 && !selectedProducts[product.idProducto] ? 'product-disabled' : ''}`}>
                                    <ProductCard
                                        imageUrl={product.imageUrl}
                                        name={product.name}
                                        description={product.description}
                                        price={product.price}
                                        cantidad={selectedProducts[product.idProducto] || 0}
                                        onClickAgregar={() => handleAgregar(product.idProducto, product.quantity)}
                                        onClickEliminar={() => handleEliminar(product.idProducto)}
                                        disabled={totalSeleccionados >= 3 && !selectedProducts[product.idProducto]} 
                                        agotado={(selectedProducts[product.idProducto] || 0) >= product.quantity}
                                    />
                                </div>
                                
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}

            </FormCard>
            <div className="solicitud-actions">
                <Button
                    type="button"
                    size="medium"
                    csstype="cancel"
                >
                    Atrás
                </Button>

                <Button
                    type="button"
                    size="medium"
                    csstype="accept"
                    onClick={handleSiguiente}
                >
                    Siguiente
                </Button>

            </div>
            
        </div>
    );
}

export default ExtraProductsView;
