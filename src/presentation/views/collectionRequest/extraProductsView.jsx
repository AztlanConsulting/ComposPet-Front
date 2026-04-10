import { useEffect } from "react";
import CollectionRequestViewModel from "../../viewmodels/collectionRequest/collectionRequestViewModel";
import ProductCard from "../../../components/molecules/ProductCard";

function ExtraProductsView() {
    const {
        products,
        loading,
        error,
        loadExtraProducts
    } = CollectionRequestViewModel();

    useEffect(() => {
        loadExtraProducts();
    }, []);

    if (loading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Extra Products</h2>

            {products.length === 0 ? (
                <p>No extra products available.</p>
            ) : (
                products.map((product) => (
                    <div key={product.idProduct}>
                        <br/>
                        <ProductCard
                            key={product.idProduct}
                            imageUrl={product.imageUrl}
                            name={product.name}
                            description={product.description}
                            price={product.price}
                        />
                    </div>
                ))
            )}

            
        </div>
    );
}

export default ExtraProductsView;