import { useEffect, useState } from "react";
import {
    extraProductsUseCase,
    saveExtraProductsUseCase,
    getLastRequestPerClientUseCase,
    getSelectedExtraProductsUseCase
} from '../../../di/collectionRequest/collectionRequestProductsDependencies';


const MIN_PRODUCT_QUANTITY = 0;
const MAX_PRODUCT_QUANTITY = 999;
const MAX_COMPOST_QUANTITY = 1;

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

    const isCompostProduct = (id, productName) => (
        id === 3 ||
        productName === 'Composta (costal)' ||
        productName === 'Composta (en costal)' ||
        id === 2 ||
        productName === 'Composta (cubeta)' ||
        productName === 'Composta (en cubeta)'
    );

    const getProductMaxQuantity = (id, productName) => (
        isCompostProduct(id, productName)
            ? MAX_COMPOST_QUANTITY
            : MAX_PRODUCT_QUANTITY
    );

    const clampProductQuantity = (value, maxQuantity) => {
        if (value === '') {
            return '';
        }

        const numericValue = Number(value);

        if (Number.isNaN(numericValue)) {
            return MIN_PRODUCT_QUANTITY;
        }

        return Math.min(
            Math.max(numericValue, MIN_PRODUCT_QUANTITY),
            maxQuantity,
        );
    };

    const updateCompostLimitMessage = (id, productName, quantity) => {
        if (!isCompostProduct(id, productName)) return;

        if (quantity >= MAX_COMPOST_QUANTITY) {
            setMessage(true);
            setName((prevProductName) => (
                prevProductName.includes(productName)
                    ? prevProductName
                    : [...prevProductName, productName]
            ));
            return;
        }

        setName((prevProductName) => {
            const updatedProductNames = prevProductName.filter(
                (nameProduct) => nameProduct !== productName,
            );

            setMessage(updatedProductNames.length > 0);

            return updatedProductNames;
        });
    };

    /**
     * Agrega una unidad de un producto extra seleccionado.
     * También actualiza el mensaje para productos específicos.
     */
    const addProduct = (id, productName) => {
        setSelectedProducts((prevSelectedProducts) => {
            const maxQuantity = getProductMaxQuantity(id, productName);
            const currentQuantity = Number(prevSelectedProducts[id] || 0);
            const nextQuantity = clampProductQuantity(currentQuantity + 1, maxQuantity);

            updateCompostLimitMessage(id, productName, nextQuantity);

            return {
                ...prevSelectedProducts,
                [id]: nextQuantity,
            };
        });
    };

    /**
     * Elimina una unidad de un producto extra seleccionado.
     * Si la cantidad llega a cero, elimina el producto del objeto.
     */
    const removeProduct = (id, productName) => {
        setSelectedProducts((prevSelectedProducts) => {
            const currentQuantity = Number(prevSelectedProducts[id] || 0);
            const nextQuantity = clampProductQuantity(
                currentQuantity - 1,
                getProductMaxQuantity(id, productName),
            );

            updateCompostLimitMessage(id, productName, nextQuantity);

            if (nextQuantity <= 0) {
                const updatedProducts = { ...prevSelectedProducts };
                delete updatedProducts[id];
                return updatedProducts;
            }

            return {
                ...prevSelectedProducts,
                [id]: nextQuantity,
            };
        });
    };

    const updateProductQuantity = (id, productName, newQuantity) => {
        setSelectedProducts((prevSelectedProducts) => {
            const maxQuantity = getProductMaxQuantity(id, productName);
            const nextQuantity = clampProductQuantity(newQuantity, maxQuantity);

            updateCompostLimitMessage(id, productName, Number(nextQuantity || 0));

            if (nextQuantity === '') {
                return {
                    ...prevSelectedProducts,
                    [id]: '',
                };
            }

            if (nextQuantity <= 0) {
                const updatedProducts = { ...prevSelectedProducts };
                delete updatedProducts[id];
                return updatedProducts;
            }

            return {
                ...prevSelectedProducts,
                [id]: nextQuantity,
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

            const productsArray = Object.entries(selectedProducts)
                .map(([id, quantity]) => ({
                    id_producto: parseInt(id, 10),
                    cantidad: Number(quantity || 0),
                }))
                .filter((product) => product.cantidad > 0);

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
        updateProductQuantity,
        saveSecondSection,
        loadData,
    };
}

export default useSecondPageViewModel;