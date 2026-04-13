import { useEffect } from "react";
import CollectionRequestViewModel from "../../viewmodels/collectionRequest/collectionRequestViewModel";
import ProductCard from "../../../components/molecules/ProductCard";
import NavBar from "../../../components/molecules/Navbar";

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

            <NavBar />
            <br />
            <h2>Productos Extra</h2>

            {products.length === 0 ? (
                <p>No extra products available.</p>
            ) : (
                products.map((product) => (
                    <div key={product.idProduct}>
                        <br />
                        <ProductCard
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