import { useEffect, useState } from "react";
import { ExtraProductsUseCase } from "../../../domain/useCases/ExtraProducts";
import { SaveExtraProductsCollection } from "../../../domain/useCases/saveExtraProductsCollection";
import { CollectionRequestRepository } from "../../../data/repositories/collectionRequestRepository";
import { CollectionRequestApiClient } from "../../../data/datasources/collectionRequestApiClient";
import { GetLastRequestPerClient } from "../../../domain/useCases/getLastRequestPerClient";
import { ExtraProductRequestCollection } from "../../../domain/useCases/extraProductRequestCollection";

function useSecondPageViewModel(idClient) {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState({});
    const [requestID, setIdSolicitud] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [message, setMessage] = useState(false);
    const [name, setName] = useState([]);

    const apiClient = new CollectionRequestApiClient();
    const repository = new CollectionRequestRepository(apiClient);

    const extraProductsUseCase = new ExtraProductsUseCase(repository);
    const saveExtraProductsUseCase = new SaveExtraProductsCollection(repository);
    const getLastRequestPerClientUseCase = new GetLastRequestPerClient(repository);
    const getSelectedExtraProductsUseCase = new ExtraProductRequestCollection(repository);

    const loadData = async () => {
        if (!idClient) return;

        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const result = await getLastRequestPerClientUseCase.execute(idClient);
            setIdSolicitud(result?.idRequest || "");

            const extraProducts = await extraProductsUseCase.execute();
            setProducts(extraProducts || []);

            const selectedExtraProducts = await getSelectedExtraProductsUseCase.execute(
                result?.idRequest || ""
            );

            console.log(selectedExtraProducts);

            const mappedSelectedProducts = {};
            (selectedExtraProducts || []).forEach((product) => {
                console.log("PRODUCT", product.idProduct, " ", product.quantity);
                mappedSelectedProducts[product.idProduct] = product.quantity;
            });

            console.log("MAPPED", mappedSelectedProducts);

            setSelectedProducts(mappedSelectedProducts);
        } catch (err) {
            setError(err.message || "Error al cargar los productos extra.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [idClient]);

    const addProduct = (id, productName) => {
        setSelectedProducts((prevSelectedProducts) => {
            const currentQuantity = prevSelectedProducts[id] || 0;

            if ( (id === 11 && currentQuantity === 0)  || (id === 2 && currentQuantity === 0)){
                setMessage(true)
                setName((prevProductName) =>
                    prevProductName.includes(productName)
                        ? prevProductName
                        : [...prevProductName, productName]
                );
            }

            return {
                ...prevSelectedProducts,
                [id]: currentQuantity + 1,
            };
        });
    };

    const removeProduct = (id, productName) => {
        setSelectedProducts((prevSelectedProducts) => {
            const currentQuantity = prevSelectedProducts[id] || 0;

            if ( (id === 11 && currentQuantity > 0)  || (id === 2 && currentQuantity > 0)){
                setMessage(name.length === 2);
                setName((prevProductName) => {
                    const updated = prevProductName.filter(n => n !== productName);
                    return updated;
                });
            }

            if (currentQuantity <= 1) {
                const updatedProducts = { ...prevSelectedProducts };
                delete updatedProducts[id];
                return updatedProducts;
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

            const result = await saveExtraProductsUseCase.execute(requestID, productsArray);

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
        message,
        name,
        addProduct,
        removeProduct,
        saveSecondSection,
        loadData,
    };
}

export default useSecondPageViewModel;