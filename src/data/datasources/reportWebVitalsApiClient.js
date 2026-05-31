import api from '../../api/axiosConfig';
import { handleHttpError } from '../infrastructure/httpErrorHandler';

/**
 * Cliente HTTP para el módulo de performance del cliente de ComposPet.
 */

export class reportWebVitalApiClient {
    /**
     * Obtiene la solicitud de recolección actual del cliente para el rango semanal indicado.
     * Si no existe, el servidor genera una nueva automáticamente.
     * * @async
     * @param {string} clientId - Id único del cliente.
     * @returns {Promise<Object>} Datos de la solicitud de recolección.
     * @throws {Error} Si el token es inválido o hay errores de red.
     */

    async sendWebVitalMetric(metricData){
        try {
            const response = await api.post('/desempeno/metricas', metricData);
            return response.data;
        } catch (error) {
            handleHttpError(error);
        }
    }
}