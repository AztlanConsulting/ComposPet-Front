import { useEffect, useState } from "react";
import {
    extraProductsUseCase,
    saveExtraProductsUseCase,
    getLastRequestPerClientUseCase,
    getSelectedExtraProductsUseCase
} from '../../../di/collectionRequest/collectionRequestProductsDependencies';

/**
 * ViewModel de la segunda sección del formulario de recolección.
 * Gestiona la carga, selección y guardado de productos extra.
 */
function useSecondPageViewModel(idClient) {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState({});
    const [requestID, setIdSolicitud] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [message, setMessage] = useState(false);
    const [name, setName] = useState([]);

    /**
     * Carga la información necesaria de la segunda sección:
     * - última solicitud del cliente
     * - productos extra disponibles
     * - productos previamente seleccionados
     */
    const loadData = async () => {
        if (!idClient) return;

        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            console.log("SECOND VIEW MODEL");
            const result = await getLastRequestPerClientUseCase.execute(idClient);
            setIdSolicitud(result?.idRequest || "");

            const extraProducts = await extraProductsUseCase.execute();
            setProducts(extraProducts || []);

            const selectedExtraProducts = await getSelectedExtraProductsUseCase.execute(
                result?.idRequest || ""
            );


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

    useEffect(() => {
        loadData();
    }, [idClient]);

    /**
     * Agrega una unidad de un producto extra seleccionado.
     * También actualiza el mensaje para productos específicos.
     */
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

    /**
     * Elimina una unidad de un producto extra seleccionado.
     * Si la cantidad llega a cero, elimina el producto del objeto.
     */
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

    /**
     * Guarda los productos extra seleccionados en la solicitud actual.
     */
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