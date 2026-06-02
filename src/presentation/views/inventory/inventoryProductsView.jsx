import InventoryCard from "../../../components/molecules/InventoryCard";
import InventoryModal from "../../../components/molecules/InventoryModal";
import GetInventoryViewModel from "../../viewmodels/inventory/getInventoryViewModel";
import Loading from "../../../components/Template/loading";
import Error from '../../../components/Template/error';
import Navbar from '../../../components/molecules/Navbar';

export default function InventoryProductsView({
    viewModel = GetInventoryViewModel(),
}) {
    const {
        inventory = [],
        selectedProduct,
        loading,
        error,
        setSelectedProduct,
        onClickCard,
    } = viewModel;

    if (loading) {
        return <Loading />;
    }

    if (error){
        return <Error message={"Error al obtener el inventario"} />;
    }

    return (
        <div className="container-fluid h-100 d-flex flex-column">
            <Navbar />
            {/* Contenedor con scroll */}
            <div
                className="row g-4 overflow-auto flex-grow-1 px-xxl-5 py-4 margin-top-navbar"
                style={{ maxHeight: "75vh" }}
            >
                {inventory.map((product) => (
                    <div
                        key={product.productId}
                        className="col-12 col-md-6 col-lg-4 col-xl-3"
                    >
                        <InventoryCard
                            product={product}
                            onClick={onClickCard}
                        />
                    </div>
                ))}
            </div>
            {selectedProduct && (
                <InventoryModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onEdit={(product) => console.log('Editar:', product)}
                    onDelete={(product) => console.log('Eliminar:', product)}
                    onToggleStatus={(product) => console.log('Cambiar estado:', product)}
                />
            )}

        </div>
    )
}