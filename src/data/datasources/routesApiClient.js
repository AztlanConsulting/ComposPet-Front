import api from '../../api/axiosConfig';
import { handleHttpError } from '../infrastructure/httpErrorHandler';

/**
 * Cliente API para operaciones relacionadas con rutas.
 * Encapsula las llamadas HTTP al backend para el módulo de rutas.
 * 
 * @class RoutesApiClient
 */
export class RoutesApiClient {
    /**
     * Obtiene la información de las rutas del día actual.
     * Realiza una petición GET al endpoint de rutas y retorna los datos de la respuesta.
     *
     * @async
     * @returns {Promise<Object>} Promesa que resuelve con un objeto conteniendo:
     * @returns {boolean} return.success - Indica si la operación fue exitosa.
     * @returns {Array<Object>} return.data - Lista de rutas con información detallada.
     * @throws {Error} Lanza un error si la petición HTTP falla o el servidor retorna un error.
     * 
     */
    async getRoutesInfo() {
        try {
            const response = await api.get('/rutas/informacion');
            return response.data;
        } catch (error) {
            console.error("Error en getRoutesInfo:", error.response?.data || error.message);
            throw error;
        }
    }

    async getAvailableWeeks() {
        try {

            const response = await api.get('/rutas/semanas');
            return response.data;
        } catch (error) {
            console.error("Error en getAvailableWeeks:", error.response?.data || error.message);
            throw error;
        }
    }
}