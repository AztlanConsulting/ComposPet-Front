/**
 * Cliente HTTP para el modulo de las solicitudes de recolección.
 * Realiza las peticiones directamente a la API REST y maneja
 * los errores de respuesta antes de retornar los datos al repositorio.
 *
 * La URL base se obtiene de la variable de entorno `REACT_APP_API_URL`.
 */

export class CollectionRequestApiClient{

     /**
     * Crea una instancia del cliente HTTP para solicitudes de recolección.
     *
     * @param {string} [baseUrl=process.env.REACT_APP_API_URL] - URL base del servidor.
     */
    constructor(baseUrl = process.env.REACT_APP_API_URL) {
        this.baseUrl = baseUrl;
    }

    /**
     * Obtiene el token de autenticación almacenado en el navegador.
     *
     * @returns {string|null} Token JWT almacenado o `null` si no existe.
     */
    getToken() {
        return sessionStorage.getItem('token');
    }

    /**
     * Obtiene la solicitud de recolección actual del cliente para el rango semanal indicado.
     * Si no existe una solicitud en ese rango, el backend crea una nueva y la retorna.
     *
     * @async
     * @param {string} clientId - Id del cliente.
     * @param {string} weekStartDate - Fecha inicial del rango semanal.
     * @param {string} weekEndDate - Fecha final del rango semanal.
     * @returns {Promise<Object>} Respuesta de la API con la solicitud encontrada o creada.
     * @throws {Error} Si la respuesta HTTP no es exitosa o no regresa JSON válido.
     */

    async getCurrentCollectionRequest(clientId, weekStartDate, weekEndDate) {

        try {

            // Recupera el token actual para autenticar la petición al backend
            const token = this.getToken();

            console.log("Token en getLastRequestPerClient del API Client:", token);

             // Envía el rango semanal necesario para obtener o crear la solicitud.
            const response = await fetch(`${this.baseUrl}/solicitudes-rec/form02/obtener`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    clientId,
                    weekStartDate,
                    weekEndDate,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener la solicitud de recolección.');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Guarda la información de la primera sección del formulario de recolección.
     *
     * @async
     * @param {string} requestId - Id de la solicitud.
     * @param {boolean} wantsCollection - Indica si el cliente desea recolección.
     * @param {boolean} wantsExtraProducts - Indica si el cliente desea productos extra.
     * @param {number} collectedBuckets - Cantidad de cubetas que el cliente entregará.
     * @param {number} deliveredBuckets - Cantidad de cubetas vacías solicitadas.
     * @returns {Promise<Object>} Respuesta de la API con la solicitud actualizada.
     * @throws {Error} Si la respuesta HTTP no es exitosa o no regresa JSON válido.
     */

    async saveCollectionRequestFirstSection(
        requestId, 
        wantsCollection, 
        wantsExtraProducts, 
        collectedBuckets, 
        deliveredBuckets
    ) {
        try{
            
            // Recupera el token actual para autenticar la petición al backend
            const token = this.getToken();

            // Envía únicamente los datos capturados en la primera sección.
            const response = await fetch(`${this.baseUrl}/solicitudes-rec/form02/guardar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    requestId,
                    wantsCollection,
                    wantsExtraProducts,
                    collectedBuckets,
                    deliveredBuckets,
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al guardar la primera sección de la solicitud de recolección.');
            }

            return data;

        } catch (error) {
            throw error;
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