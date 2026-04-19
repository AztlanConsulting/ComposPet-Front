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

    /**
     * Obtiene los productos extra disponibles para la solicitud de recolección actual.
     *
     * @async
     * @returns {Promise<Object>} Respuesta de la API con la lista de productos extra.
     * @throws {Error} Si la respuesta HTTP no es exitosa o no regresa JSON válido.
     */
    async getExtraProducts() {
        try {
            const token = this.getToken();

            const response = await fetch(`${this.baseUrl}/solicitudes-rec/form04/obtener`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log("Response cruda del API Client getExtraProducts:", response);

            const data = await response.json();

            console.log("Response cruda del API Client getExtraProducts:", data);

            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener los productos extra de la solicitud de recolección.');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Guarda los productos extra seleccionados en la segunda sección
     * del formulario de recolección.
     *
     * @async
     * @param {string} requestIDReceived - Id de la solicitud.
     * @param {Array<Object>} products - Lista de productos extra seleccionados.
     * @returns {Promise<Object>} Respuesta de la API con el resultado del guardado.
     * @throws {Error} Si la respuesta HTTP no es exitosa o no regresa JSON válido.
     */
    async saveExtraProducts(
        requestIDReceived,
        products,
    ) {
        try{
            const token = this.getToken();
            console.log("Token", token)

            const response = await fetch(`${this.baseUrl}/solicitudes-rec/form04/guardar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    requestIDReceived,
                    products
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al guardar los productos extra de la solicitud de recolección.');
            }

            return data;

        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene el id de la última solicitud de recolección
     * asociada al cliente.
     *
     * @async
     * @param {string} idClient - Id del cliente.
     * @returns {Promise<string>} Id de la última solicitud registrada.
     * @throws {Error} Si la respuesta HTTP no es exitosa o no regresa JSON válido.
     */
    async getLastRequestPerClient(
        idClient,
    ) {
        try{

            const token = this.getToken();

            const response = await fetch(`${this.baseUrl}/solicitudes-rec/ultimaSolicitud`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    idClient,
                })
            });

            // console.log("Respuesta cruda del API Client getLastRequestPerClient:", response);

            const data = await response.json();
            // console.log("RESPUESTA DE OBTENER ULTIMA SOLICITUD EN EL API CLIENT:", data);

            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener la última solicitud de recolección.');
            }

            return data.data.id_solicitud;

        } catch (error) {
            console.log("ERRRRRRROR", error)
            throw error;
        }
    }

    /**
     * Obtiene la información de los productos extra previamente
     * seleccionados para una solicitud de recolección.
     *
     * @async
     * @param {string} requestID - Id de la solicitud.
     * @returns {Promise<Object>} Respuesta de la API con los productos seleccionados.
     * @throws {Error} Si la respuesta HTTP no es exitosa o no regresa JSON válido.
     */
    async getInfoAboutExtraProductsSelected(
        requestID,
    ) {
        try{
            console.log("Llega al SolicitudesRecApiClient Guardar con:", {
                requestID,
            });

            const token = this.getToken();
            console.log("TOKEN", token);

            const response = await fetch(`${this.baseUrl}/solicitudes-rec/form03/obtenerInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    requestID,
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener los productos extra seleccionados de la solicitud de recolección.');
            }

            return data;

        } catch (error) {
            throw error;
        }
    }
}