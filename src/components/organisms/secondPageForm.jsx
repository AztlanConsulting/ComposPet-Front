import ProductCard from "../molecules/ProductCard";
import FormCard from "../Template/formCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../css/organisms/extraProductsPageForm.css';
import Loading from '../Template/loading';
import Error from '../Template/error';

function SecondPageForm({ segundaSeccionVM }) {
    const {
        products,
        selectedProducts,
        loading,
        error,
        handleAgregar,
        handleEliminar,
    } = segundaSeccionVM;

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <Error message={error} />;
    }

    const totalSeleccionados = Object.keys(selectedProducts).length;

    return (
        <div className="secondPage">
            <FormCard className="extra-products-form-card">
                <h2>Productos Extra</h2>

                {/* {totalSeleccionados >= 3 && (
                    <p className="limite-mensaje">
                        Has alcanzado el límite de 3 productos adicionales.
                    </p>
                )} */}

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
                        {products.map((product) => (
                            <SwiperSlide key={product.idProducto}>
                                <div
                                    // className={`swiper-product-card ${
                                    //     totalSeleccionados >= 3 && !selectedProducts[product.idProducto]
                                    //         ? 'product-disabled'
                                    //         : ''
                                    // }`}
                                >
                                    <ProductCard
                                        imageUrl={product.imageUrl}
                                        name={product.name}
                                        description={product.description}
                                        price={product.price}
                                        cantidad={selectedProducts[product.idProducto] || 0}
                                        onClickAgregar={() => handleAgregar(product.idProducto, product.quantity)}
                                        onClickEliminar={() => handleEliminar(product.idProducto)}
                                        disabled={
                                            totalSeleccionados >= 3 &&
                                            !selectedProducts[product.idProducto]
                                        }
                                        agotado={
                                            (selectedProducts[product.idProducto] || 0) >= product.quantity
                                        }
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </FormCard>
        </div>
    );
}

export default SecondPageForm;