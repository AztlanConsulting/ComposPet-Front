import api from '../../api/axiosConfig'; 
import { handleHttpError } from '../infrastructure/httpErrorHandler';

export class InventoryApiClient {
    
    /**
     * Obtiene el inventario de productos extra disponibles para la compra.
     * @async
     * @returns {Promise<List<Object>>} Lista de productos extra disponibles.
     * @throws {Error} Si ocurre un error en la solicitud o el token es inválido.
     */
    async registerProduct(productData) {
        try {
            const formData = new FormData();

            formData.append('name', productData.name);
            formData.append('price', productData.price);
            formData.append('quantity', productData.quantity);
            formData.append('color', productData.color);

            if (productData.description) {
                formData.append('description', productData.description);
            }

            if (productData.imageFile) {
                formData.append('image', productData.imageFile);
            }

            const response = await api.post(
                '/inventario/agregar-producto',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            return response.data.data;
        } catch (error) {
            handleHttpError(error);
        }
    }
}