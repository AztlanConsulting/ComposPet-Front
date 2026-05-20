import api from '../../api/axiosConfig'; 
import { handleHttpError } from '../infrastructure/httpErrorHandler';

export class LogoutApiClient {

    /**
     * Envía una solicitud POST al servidor para invalidar la sesión actual del usuario.
     * * @async
     * @method logout
     * @returns {Promise<any>} Promesa que resuelve con los datos de la respuesta del servidor si la petición es exitosa.
     * @throws {Error} Delega el manejo de errores al manejador HTTP de la infraestructura si la petición falla.
     */
    async logout() {
        try {
            const response = await api.post('/cerrar-sesion');
            return response.data;
        } catch (error) {
            handleHttpError(error);
        }
    }
}