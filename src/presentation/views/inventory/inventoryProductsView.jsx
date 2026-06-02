import InventoryCard from "../../../components/molecules/InventoryCard";
import InventoryModal from "../../../components/molecules/InventoryModal";
import GetInventoryViewModel from "../../viewmodels/inventory/getInventoryViewModel";
import Loading from "../../../components/Template/loading";
import Error from '../../../components/Template/error';
import Navbar from '../../../components/molecules/Navbar';

/**
 *
 */
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
        isSmall
    } = viewModel;

    // Si el estado es cargando muestra la pantalla
    // de carga
    if (loading) {
        return <Loading />;
    }

    // Si el estado es de error muestra la pantalla
    // de error
    if (error){
        return <Error message={"Error al obtener el inventario"} />;
    }

    return (
        <div className="container-fluid h-100 d-flex flex-column px-0">
            {/*
                Contenedor principal del listado.
                Ajusta el padding dependiendo del tamaño
                de pantalla y permite scroll vertical.
            */}
            <div
                className="overflow-auto flex-grow-1 py-4 inventory-content-wrapper"
                style={{
                    maxHeight: "75vh",
                    paddingLeft: isSmall ? "1rem" : "4.5rem",
                    paddingRight: isSmall ? "1rem" : "4.5rem"
                }}
            >
                <div className="row g-4 mx-0">
                    {inventory.map((product) => (
                        <div
                            key={product.productId}
                            className="col-12 col-md-6 col-lg-4 col-xl-3"
                        >
                            {/*
                                Tarjeta individual del producto.
                                Al seleccionarla ejecuta la acción
                                definida en el ViewModel.
                            */}
                            <InventoryCard
                                product={product}
                                onClick={onClickCard}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/*
                Modal mostrado únicamente cuando existe
                un producto seleccionado.
            */}
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
    );
}