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

    console.log("ID CLIENT EN EL VIEWMODEL DE LA SEGUNDA PÁGINA", idClient);

    useEffect(() => {
        const loadData = async () => {

            console.log("idClient:", idClient);

            if (!idClient) return;

            setLoading(true);
            setError("");
            setSuccessMessage("");

            try {
                const solicitud = await getLastRequestPerClientUseCase.execute(idClient);
                setIdSolicitud(solicitud?.idRequest || "");

                const extraProducts = await extraProductsUseCase.execute();
                setProducts(extraProducts || []);

                console.log("PRODUCTOS EXTRA OBTENIDOS", extraProducts);

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
    }, [idClient]);

    const addProduct = (id, availableStock, productName) => {
        setSelectedProducts((prevSelectedProducts) => {
            const currentQuantity = prevSelectedProducts[id] || 0;
            console.log("Cantidad actual del producto", id, ":", currentQuantity);
            if (currentQuantity >= availableStock){
                return prevSelectedProducts
            };

            if ( (id == 3 && currentQuantity == 0)  || (id == 2 && currentQuantity == 0)){
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
            console.log("ALOPOOOO")
            const currentQuantity = prevSelectedProducts[id] || 0;

            if ( (id == 3 && currentQuantity > 0)  || (id == 2 && currentQuantity > 0)){
                console.log("NETROOOOOO")
                setMessage(name.length == 2);
                setName((prevProductName) => {
                    const updated = prevProductName.filter(n => n !== productName);
                    return updated;
                });
            }

            if (currentQuantity <= 1) {
                const { [id]: removedProduct, ...remainingProducts } = prevSelectedProducts;
                return remainingProducts;
            }
            console.log("ALOPOOOO2")

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
        message,
        name,
        addProduct,
        removeProduct,
        saveSecondSection,
    };
}

export default useSecondPageViewModel;