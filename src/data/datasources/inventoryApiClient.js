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
            const response = await api.post('/inventario/productos-extra', {
                name: productData.name,
                price: productData.price,
                description: productData.description,
                quantity: productData.quantity,
                imageUrl: productData.imageUrl,
                color: productData.color,
            });
            return response.data.data;
        } catch (error) {
            handleHttpError(error);
        }
    }; 
    
}