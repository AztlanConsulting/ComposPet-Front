import api from '../../api/axiosConfig';
import { handleHttpError } from '../infrastructure/httpErrorHandler';

/**
 * Cliente HTTP para el módulo de tarjetas del cliente de ComposPet.
 * Gestiona la obtención y actualización de formularios semanales.
 */

export class CreditApiClient {
    /**
     * Obtiene la solicitud de recolección actual del cliente para el rango semanal indicado.
     * Si no existe, el servidor genera una nueva automáticamente.
     * * @async
     * @param {string} clientId - Id único del cliente.
     * @returns {Promise<Object>} Datos de la solicitud de recolección.
     * @throws {Error} Si el token es inválido o hay errores de red.
     */

    async getCreditBalance(clientId){
        try {
            const response = await api.post('/saldo/consultar-saldo', {
                clientId
            });

            return response.data;
        } catch (error) {
            handleHttpError(error);
        }
    }
}