import api from '../../api/axiosConfig'; 
import { handleHttpError } from '../infrastructure/httpErrorHandler';

/**
 * Cliente HTTP para el módulo de las solicitudes de recolección de ComposPet.
 * Gestiona la obtención y actualización de formularios semanales.
 */
export class CollectionRequestApiClient {
    /**
     * Obtiene la solicitud de recolección actual del cliente para el rango semanal indicado.
     * Si no existe, el servidor genera una nueva automáticamente.
     * * @async
     * @param {string} clientId - Id único del cliente.
     * @param {string} weekStartDate - Fecha inicial (ISO) del rango semanal.
     * @param {string} weekEndDate - Fecha final (ISO) del rango semanal.
     * @returns {Promise<Object>} Datos de la solicitud de recolección.
     * @throws {Error} Si el token es inválido o hay errores de red.
     */
    async getCurrentCollectionRequest(clientId, weekStartDate, weekEndDate) {
        try {
            const response = await api.post('/solicitudes-rec/form02/obtener', {
                clientId,
                weekStartDate,
                weekEndDate,
            });

            return response.data;
        } catch (error) {
            handleHttpError(error);
        }
    }

    /**
     * Actualiza la información de la primera sección del formulario de recolección.
     * * @async
     * @param {string} requestId - Id de la solicitud a actualizar.
     * @param {boolean} wantsCollection - Si el cliente entregará residuos.
     * @param {boolean} wantsExtraProducts - Si el cliente solicitó productos adicionales.
     * @param {number} collectedBuckets - Cantidad de cubetas llenas entregadas.
     * @param {number} deliveredBuckets - Cantidad de cubetas vacías recibidas.
     * @returns {Promise<Object>} Objeto de la solicitud actualizado.
     * @throws {Error} Mensaje descriptivo del error ocurrido.
     */
    async saveCollectionRequestFirstSection(
        requestId, 
        wantsCollection, 
        wantsExtraProducts, 
        collectedBuckets, 
        deliveredBuckets
    ) {
        try {
            const response = await api.post('/solicitudes-rec/form02/guardar', {
                requestId,
                wantsCollection,
                wantsExtraProducts,
                collectedBuckets,
                deliveredBuckets,
            });

            return response.data;
        } catch (error) {
            handleHttpError(error);
        }
    }
}