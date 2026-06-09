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
            // Interceptor de rutas api.post, para token
            // Envía el id del usuario al back y llama a la ruta
            const response = await api.post('/solicitudes-rec/form02/obtener', {
                clientId,
                weekStartDate,
                weekEndDate,
            });

            //respuesta del back
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

            // Carpeta para manejo de errores de tipo api
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
            const response = await api.get('/solicitudes-rec/form04/obtener');
            return response.data;
        } catch (error) {
            handleHttpError(error);
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
    async saveExtraProducts(requestIDReceived, products) {
        try {
            const response = await api.post('/solicitudes-rec/form04/guardar', {
                requestIDReceived,
                products
            });

            return response.data;
        } catch (error) {
            handleHttpError(error);
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
    async getLastRequestPerClient(idClient) {
        try {
            const response = await api.post('/solicitudes-rec/ultimaSolicitud', {
                idClient
            });

            return response.data.data.id_solicitud;
        } catch (error) {
            handleHttpError(error);
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
    async getInfoAboutExtraProductsSelected(requestID) {
        try {
            const response = await api.post('/solicitudes-rec/form03/obtenerInfo', {
                requestID
            });

            return response.data;
        } catch (error) {
            handleHttpError(error);
        }
    }

    /**
     * Actualiza la información de la primera sección del formulario de recolección.
     * * @async
     * @param {string} idClient - Id del cliente.
     * @param {Date} weekStartDate - Fecha de inicio de la semana.
     * @param {Date} weekEndDate - Fecha de fin de la semana
     * @returns {Promise<Object>} Entidad del resumen de la solicitud.
     * @throws {Error} Mensaje descriptivo del error ocurrido.
     */
    async getSummary(idClient, weekStartDate, weekEndDate) {
        try {

            const response = await api.post('/solicitudes-rec/resumen-recoleccion',
                {
                    idClient,
                    weekStartDate,
                    weekEndDate
                }
            );
            console.log("DATA: ", response.data);
            return response.data;
        }

        catch (error) {
            handleHttpError(error);
        }

    }

    /**
     * Elimina un pedido de producto de la lista asociada a la solicitud de recolección.
     * * @async
     * @param {string} idProduct - Id del producto a eliminar.
     * @param {string} idRequest -- Id de la solicitud de recolección asociada al producto.
     * @returns {Promise<Object>} 
     * @throws {Error} Mensaje descriptivo del error ocurrido.
     */
    async deleteProduct(idProduct, idRequest, quantity){
        try {
            const response = await api.delete(`/solicitudes-rec/resumen-recoleccion/producto/${idProduct}/solicitud/${idRequest}/${quantity}`);

            return response;
        }
        catch (error) {
            handleHttpError(error);
        }
    }

    /**
     * Actualiza la información de la recolección.
     * * @async
     * @param {string} idRequest -- Id de la solicitud de recolección asociada al producto.
     * @param {Int} collectionTotal - Costo total de la recolección.
     * @param {Int} idPayment - Id del método de pago seleccionado.
     * @param {string} notes - Notas adicionales a la recolección.
     * @returns {Promise<Object>} 
     * @throws {Error} Mensaje descriptivo del error ocurrido.
     */
    async updateCollectionTotal(idRequest, collectionTotal, idPayment, notes){
        try {
            const response = await api.put('/solicitudes-rec/resumen-recoleccion/pago', {
                idRequest,
                collectionTotal,
                idPayment,
                notes,
            })
        }
        catch (error) {
            handleHttpError(error);
        }
    }
}