import ProductCard from "../molecules/ProductCard";
import FormCard from "../Template/formCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../css/organisms/extraProductsPageForm.css';
import Loading from '../Template/loading';
import Error from '../Template/error';

function SecondPageForm({ secondSectionViewModel }) {
    const {
        products,
        selectedProducts,
        loading,
        error,
        addProduct,
        removeProduct,
        message,
        name
    } = secondSectionViewModel;

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <Error message={error} />;
    }

    // const totalSeleccionados = Object.keys(selectedProducts).length;

    return (
        <div className="secondPage">
            <FormCard className="extra-products-form-card">
                <h2>Productos Extra</h2>

                {
                    message && (
                        <p className="limite-mensaje">Haz alcanzado el maximo de {name.join(", ")}</p>
                    )
                }

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
                            <SwiperSlide key={product.idProduct}>
                                {/* {(product.name == "Composta (en cubeta)" || product.name === "Composta (en costal)") && selectedProducts[product.idProduct] == 1 && (
                                    <p className="product-agotado">Haz alcanzado el maximo de {product.name}</p>
                                )} */}
                                <div
                                    className="swiper-product-card"
                                //     {`swiper-product-card"
                                //          ${
                                //         (product.name == "Composta (en cubeta)" || product.name === "Composta (en costal)") && selectedProducts[product.idProduct] == 1
                                //             ? 'product-disabled'
                                //             : ''
                                //     }`
                                // }
                                >
                                    <ProductCard
                                        imageUrl={product.imageUrl}
                                        name={product.name}
                                        description={product.description}
                                        price={product.name === "Composta (en costal)" || product.name === "Composta (en cubeta)" || product.name === "Composta (en costal)" || "Composta (en cubeta)" ? "Sin costo" : product.price}
                                        cantidad={selectedProducts[product.idProduct] || 0}
                                        onClickAgregar={() => addProduct(product.idProduct, product.quantity, product.name)}
                                        onClickEliminar={() => removeProduct(product.idProduct, product.name)}
                                        agotado={
                                            (product.name == "Composta (en cubeta)" || product.name === "Composta (en costal)") && selectedProducts[product.idProduct] == 1
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