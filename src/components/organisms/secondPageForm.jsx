import ProductCard from "../molecules/ProductCard";
import FormCard from "../Template/formCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../css/organisms/extraProductsPageForm.css';
import Loading from '../Template/loading';
import Error from '../Template/error';

/**
 * Componente de la segunda sección del formulario de recolección.
 * Muestra los productos extra disponibles y permite agregarlos o eliminarlos.
 */
function SecondPageForm({ secondSectionViewModel }) {
    const {
        products,
        selectedProducts,
        loading,
        error,
        addProduct,
        removeProduct,
        updateProductQuantity,
        message,
        name
    } = secondSectionViewModel;

    // Muestra pantalla de carga mientras se obtienen los productos
    if (loading) {
        return <Loading />;
    }

    // Muestra plantilla de error si ocurrió un problema al cargar
    if (error) {
        return <Error message={error} />;
    }

    return (
        <div className="secondPage">
            <FormCard className="extra-products-form-card">
                <h2 className="extra-products-title">Productos extra</h2>

                {/* Muestra mensaje cuando se alcanza el límite de productos especiales */}
                {
                    message && (
                        <p className="limite-mensaje">Haz alcanzado el maximo de {name.join(", ")}</p>
                    )
                }

                {/* Muestra mensaje si no hay productos extra disponibles */}
                {products.length === 0 ? (
                    <p>No hay productos extra disponibles.</p>
                ) : (
                    <Swiper
                        modules={[Navigation]}
                        navigation
                        slidesPerView={4}
                        spaceBetween={50}
                        breakpoints={{
                            320: { slidesPerView: 1 },
                            600: { slidesPerView: 2 },
                            900: { slidesPerView: 3 },
                            1200: { slidesPerView: 4 },
                        }}
                    >
                        {/* Renderiza cada producto extra dentro del carrusel */}
                        {products.map((product) => {
                        const isCompostProduct =
                            product.name === 'Composta (costal)' ||
                            product.name === 'Composta (en costal)' ||
                            product.idProduct === 3 ||
                            product.name === 'Composta (cubeta)' ||
                            product.name === 'Composta (en cubeta)' ||
                            product.idProduct === 2;

                        const maxQuantity = isCompostProduct ? 1 : 999;
                        const currentQuantity = selectedProducts[product.idProduct] ?? 0;

                        return (
                            <SwiperSlide key={product.idProduct}>
                                <div className="swiper-product-card">
                                    <ProductCard
                                        imageUrl={product.imageUrl}
                                        name={product.name}
                                        price={
                                            isCompostProduct ||
                                            product.name === 'Aserrín' ||
                                            product.idProduct === 1
                                                ? 'Sin costo'
                                                : product.price
                                        }
                                        cantidad={currentQuantity}
                                        maxQuantity={maxQuantity}
                                        onClickAgregar={() => addProduct(product.idProduct, product.name)}
                                        onClickEliminar={() => removeProduct(product.idProduct, product.name)}
                                        onQuantityChange={(newQuantity) =>
                                            updateProductQuantity(product.idProduct, product.name, newQuantity)
                                        }
                                        agotado={Number(currentQuantity || 0) >= maxQuantity}
                                    />
                                </div>
                            </SwiperSlide>
                        );
                    })}
                    </Swiper>
                )}
            </FormCard>
        </div>
    );
}

export default SecondPageForm;