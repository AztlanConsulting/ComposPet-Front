import api from '../../api/axiosConfig'; 
import { handleHttpError } from '../infrastructure/httpErrorHandler';

export class ClientApiClient {
    
    /**
     * Obtiene la información básica del cliente asociado al id del usuario proporcionado.
     * * @async
     * @param {string} userId - Id del usuario (procedente del token o sesión).
     * @returns {Promise<Object>} Datos del cliente encontrado.
     * @throws {Error} Si el token es inválido o el cliente no existe.
     */
    async getClientByUserId(userId) {
        try {
            // Ya no es necesario mandar el token por que hay un interceptor de rutas, es el api.post
            // Envía el id del usuario al back y llama a la ruta
            const response = await api.post('/cliente/obtener-cliente-y-ruta', { userId });
            return response.data;

        } catch (error) {
            handleHttpError(error);
        }
    }

    /**
     * Obtiene la lista de clientes de Compospet
     * * @async
     * @returns {Promise<List<Object>>} Lista de clientes
     * @throws {Error}
     */
    async getClientTable(){
        try{

            const response = await api.get('cliente/informacion');
            return response.data.clientList;

        } catch (error) {
            handleHttpError(error);
        }
    }
}