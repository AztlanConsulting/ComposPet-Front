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

    /**
     * Obtiene las semanas disponibles para filtrar rutas.
     *
     * @async
     * @returns {Promise<Object>} Respuesta del backend con las semanas disponibles.
     * @throws {Error} Lanza un error si falla la petición HTTP.
     */
    async getAvailableWeeks() {
        try {
            const response = await api.get('/rutas/semanas');
            return response.data;
        } catch (error) {
            console.error("Error en getAvailableWeeks:", error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Obtiene todos los días de ruta disponibles.
     *
     * @async
     * @returns {Promise<Object>} Respuesta del backend con los días de ruta.
     * @throws {Error} Lanza un error si falla la petición HTTP.
     */
    async getDaysOfRoutes() {
        try {
            const response = await api.get('/rutas/dias-ruta');
            return response.data;
        } catch (error) {
            console.error("Error en getDaysOfRoutes:", error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Obtiene las rutas filtradas por semana y día.
     *
     * @async
     * @param {number} weekIndex - Índice de la semana seleccionada.
     * @param {string} [dayName] - Día de ruta a filtrar.
     * @returns {Promise<Object>} Respuesta del backend con las rutas filtradas.
     * @throws {Error} Lanza un error si falla la petición.
     */
    async getFilteredRoutes(weekIndex, dayName){
        try {
            const params = {
                weekIndex,
            };
            if (dayName) params.dayName = dayName;

            const response = await api.get('/rutas/filtrar-informacion', { params });
            return response.data;
        } catch (error) {
            console.error("Error en getFilteredRoutes:", error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Solicita al backend la generación de mensajes de confirmación
     * para una semana y día de ruta específicos.
     * 
     * Envía un POST al endpoint correspondiente con los parámetros necesarios, y espera la respuesta del servidor.
     *
     * @async
     * @param {number} weekIndex - Índice de la semana seleccionada.
     * @param {string} dayName - Día de ruta seleccionado.
     * @returns {Promise<Object>} Respuesta del backend 
     * @throws {Error} Lanza un error si ocurre un fallo.
     */
    async generateConfirmationMessages(weekIndex, dayName){
        try {

            const response = await api.post('/rutas/mensajes-de-confirmacion', {
                weekIndex,
                dayName,
            });
            
            return response.data;
        } catch (error) {
            console.error("Error en generateConfirmationMessages:", error.response?.data || error.message);
            throw error;
        }
    }
}