import { useEffect, useState } from "react";
import { ExtraProductsUseCase } from "../../../domain/useCases/ExtraProducts";
import { SaveExtraProductsCollection } from "../../../domain/useCases/saveExtraProductsCollection";
import { CollectionRequestRepository } from "../../../data/repositories/collectionRequestRepository";
import { CollectionRequestApiClient } from "../../../data/datasources/collectionRequestApiClient";
import { GetLastRequestPerClient } from "../../../domain/useCases/getLastRequestPerClient";
import { ExtraProductRequestCollection } from "../../../domain/useCases/extraProductRequestCollection";

function useSecondPageViewModel(idClient, isActive) {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState({});
    const [requestID, setIdSolicitud] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const apiClient = new CollectionRequestApiClient();
    const repository = new CollectionRequestRepository(apiClient);
    const extraProductsUseCase = new ExtraProductsUseCase(repository);
    const saveExtraProductsUseCase = new SaveExtraProductsCollection(repository);
    const getLastRequestPerClientUseCase = new GetLastRequestPerClient(repository);
    const getSelectedExtraProductsUseCase = new ExtraProductRequestCollection(repository);

    useEffect(() => {
        const loadData = async () => {
            if (!idClient || !isActive) return;

            setLoading(true);
            setError("");
            setSuccessMessage("");

            try {
                const solicitud = await getLastRequestPerClientUseCase.execute(idClient);
                setIdSolicitud(solicitud?.idRequest || "");

                const extraProducts = await extraProductsUseCase.execute();
                setProducts(extraProducts || []);

                const selectedExtraProducts = await getSelectedExtraProductsUseCase.execute(
                    solicitud?.idRequest || ""
                );

                console.log("PRODUCTOS EXTRA SELECCIONADOS OBTENIDOS", selectedExtraProducts);

                const mappedSelectedProducts = {};
                (selectedExtraProducts || []).forEach((product) => {
                    mappedSelectedProducts[product.idProduct] = product.quantity;
                });

                setSelectedProducts(mappedSelectedProducts);
            } catch (err) {
                setError(err.message || "Error al cargar los productos extra.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [idClient, isActive]);

    const addProduct = (id, availableStock) => {
        setSelectedProducts((prevSelectedProducts) => {
            const totalSelectedProducts = Object.keys(prevSelectedProducts).length;
            const currentQuantity = prevSelectedProducts[id] || 0;

            if (currentQuantity >= availableStock) return prevSelectedProducts;
            if (totalSelectedProducts >= 3 && !prevSelectedProducts[id]) return prevSelectedProducts;

            return {
                ...prevSelectedProducts,
                [id]: currentQuantity + 1,
            };
        });
    };

    const removeProduct = (id) => {
        setSelectedProducts((prevSelectedProducts) => {
            const currentQuantity = prevSelectedProducts[id] || 0;

            if (currentQuantity <= 1) {
                const { [id]: removedProduct, ...remainingProducts } = prevSelectedProducts;
                return remainingProducts;
            }

            return {
                ...prevSelectedProducts,
                [id]: currentQuantity - 1,
            };
        });
    };

    const saveSecondSection = async () => {
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            if (!requestID) {
                throw new Error("No hay solicitud activa.");
            }

            const productsArray = Object.entries(selectedProducts).map(([id, quantity]) => ({
                id_producto: parseInt(id, 10),
                cantidad: quantity,
            }));

            console.log("PRODUCTOS A GUARDAR", productsArray, requestID);

            // if (productsArray.length === 0) {
            //     throw new Error("Debes seleccionar al menos un producto extra.");
            // }

            const result = await saveExtraProductsUseCase.execute(requestID, productsArray);

            console.log("RESULTADO DE GUARDAR PRODUCTOS EXTRA", result);

            setSuccessMessage(result.message || "Productos guardados correctamente.");

            return {
                success: true,
                nextStep: 3,
            };
        } catch (err) {
            setError(err.message || "Error al guardar productos extra.");
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        selectedProducts,
        requestID,
        loading,
        error,
        successMessage,
        addProduct,
        removeProduct,
        saveSecondSection,
    };
}

export default useSecondPageViewModel;