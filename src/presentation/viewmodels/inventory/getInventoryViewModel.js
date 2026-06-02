import {useEffect, useState} from 'react';
import { getInventoryUseCase } from '../../../di/inventory/inventoryDependencies';

function GetInventoryViewModel(){
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            setError(null);

            const inventoryData = await getInventoryUseCase.execute();

            console.log("Inventario obtenido:", inventoryData);

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

    const onClickCard = (product) => {
        setSelectedProduct(product);
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    return {
        inventory,
        selectedProduct,
        loading,
        error,
        fetchInventory,
        setSelectedProduct,
        onClickCard,
    };
}

export default GetInventoryViewModel;