import {useEffect, useState} from 'react';
import { getInventoryUseCase } from '../../../di/inventory/inventoryDependencies';

/**
 * ViewModel para la vista de inventario.
 * Maneja el estado y la lógica de obtención de productos,
 * selección de tarjeta y detección de tamaño de pantalla.
 *
 * @returns {Object} Estado y funciones para la vista de inventario
 */
function GetInventoryViewModel(){
    // estado para guardar el inventario
    const [inventory, setInventory] = useState([]);
    // Estado para cargar de la pantalla
    const [loading, setLoading] = useState(false);
    // Estado para el error
    const [error, setError] = useState(null);
    // Estado para saber que producto se selecciono
    const [selectedProduct, setSelectedProduct] = useState(null);
    // Estado para saber si la pantalla es pequeña
    const [isSmall, setIsSmall] = useState(window.innerWidth < 768);

    // Función para obtener el inventario
    const loadInventory = async () => {
        try {
            setLoading(true);
            setError(null);

            const inventoryData = await getInventoryUseCase.execute();
            console.log("inventoryData", inventoryData);

            setInventory(inventoryData);

        } catch (error) {
            console.error('Error obteniendo inventario:', error);

            setError(
                error.message ||
                'Ocurrió un error al obtener el inventario.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Al darle clic a una card de algún producto
    const onClickCard = (product) => {
        setSelectedProduct(product);
    };

    useEffect(() => {
        // Variable para saber si la pantalla es menor a 768px
        const handleResize = () => setIsSmall(window.innerWidth < 768);
        // Event listener para estar al pendiente de la pantalla
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        loadInventory();
    }, []);

    return {
        inventory,
        selectedProduct,
        loading,
        error,
        loadInventory,
        setSelectedProduct,
        onClickCard,
        isSmall,
    };
}

export default GetInventoryViewModel;