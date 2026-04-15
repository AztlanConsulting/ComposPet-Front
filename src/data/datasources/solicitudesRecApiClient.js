/**
 * Cliente HTTP para el modulo de las solicitudes de recolección.
 * Realiza las peticiones directamente a la API REST y maneja
 * los errores de respuesta antes de retornar los datos al repositorio.
 *
 * La URL base se obtiene de la variable de entorno `REACT_APP_API_URL`.
 */

export class SolicitudesRecApiClient {

    /**
     * @param {string} [baseUrl=process.env.REACT_APP_API_URL] - URL base del servidor.
     * Debe configurarse en el archivo `.env` del proyecto.
     */
    constructor(baseUrl = process.env.REACT_APP_API_URL) {
        this.baseUrl = baseUrl;
    }

    /**
     * Obtiene el token de autenticación almacenado en el navegador.
     *
     * @returns {string} Token JWT almacenado.
     */
    getToken() {
        return sessionStorage.getItem('token');
    }

    /**
     * Obtiene la solicitud de recolección actual del cliente para el rango semanal indicado.
     * Si no existe una solicitud en ese rango, el backend crea una nueva y la retorna.
     *
     * @param {string} idCliente - Id del cliente en formato UUID. si es que existe.
     * @param {string} fechaInicioSemana - Fecha inicial del rango semanal.
     * @param {string} fechaFinSemana - Fecha final del rango semanal.
     * @throws {Error} Si la respuesta HTTP no es exitosa o no regresa JSON válido.
     */

    async obtenerSolicitudRecActual(idCliente, fechaInicioSemana, fechaFinSemana) {

        try {
            console.log("Llega al SolicitudesRecApiClient con:", {idCliente, fechaInicioSemana, fechaFinSemana});

            const token = this.getToken();
            console.log('Token usado para obtener solicitud:', token);
            
            const response = await fetch(`${this.baseUrl}/solicitudes_rec/form02/obtener`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({idCliente,fechaInicioSemana,fechaFinSemana}),
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
     * Guarda la información de la primera sección del formulario de recolección
     *
     * @param {string} idSolicitud - Id de la solicitud 
     * @param {boolean} quiereRecoleccion - Indica si el cliente desea recolección
     * @param {boolean} quiereProductosExtra - Indica si el cliente desea productos extra
     * @param {number} cubetasRecolectadas - Cantidad de cubetas que el cliente entregará
     * @param {number} cubetasEntregadas - Cantidad de cubetas vacías solicitadas
     * @throws {Error} Si la respuesta HTTP no es exitosa o no regresa JSON válido
    */

    async guardarSolicitudRecPrimeraSeccion(
        idSolicitud, 
        quiereRecoleccion, 
        quiereProductosExtra, 
        cubetasRecolectadas, 
        cubetasEntregadas
    ) {
        try{
            // console.log("Llega al SolicitudesRecApiClient con:", {
            //     idSolicitud,
            //     quiereRecoleccion,
            //     quiereProductosExtra,
            //     cubetasRecolectadas,
            //     cubetasEntregadas
            // });

            const token = this.getToken();

            const response = await fetch(`${this.baseUrl}/solicitudes_rec/form02/guardar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    idSolicitud, 
                    quiereRecoleccion, 
                    quiereProductosExtra, 
                    cubetasRecolectadas, 
                    cubetasEntregadas
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
     */

    async getExtraProducts () {
        try {

            const token = this.getToken();

            const response = await fetch(`${this.baseUrl}/solicitudes_rec/form04/obtener`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener los productos extra de la solicitud de recolección.');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    async guardarProductosExtra(
        id_solicitud,
        productos,
    ) {
        try{
            console.log("Llega al SolicitudesRecApiClient Guardar con:", {
                id_solicitud,
                productos
            });

            const token = this.getToken();

            const response = await fetch(`${this.baseUrl}/solicitudes_rec/form04/guardar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_solicitud,
                    productos
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

    async obtenerUltimaSolicitudRec(
        idCliente,
    ) {
        try{
            console.log("Llega al SolicitudesRecApiClient ObtenerUltimaSolicitud con:", {
                idCliente,
            });

            const token = this.getToken();

            const response = await fetch(`${this.baseUrl}/solicitudes_rec/ultimaSolicitud`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_cliente : idCliente,
                })
            });

            const data = await response.json();
            console.log("RESPUESTA DE OBTENER ULTIMA SOLICITUD EN EL API CLIENT:", data.data.id_solicitud);

            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener la última solicitud de recolección.');
            }

            return data.data.id_solicitud;

        } catch (error) {
            console.log("ERRRRRRRO", error)
            throw error;
        }
    }

    async getInfoAboutExtraProductsSelected(
        requestID,
    ) {
        try{
            console.log("Llega al SolicitudesRecApiClient Guardar con:", {
                requestID,
            });

            const token = this.getToken();

            const response = await fetch(`${this.baseUrl}/solicitudes_rec/form03/obtenerInfo`, {
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
                throw new Error(data.message || 'Error al guardar los productos extra de la solicitud de recolección.');
            }

            return data;

        } catch (error) {
            throw error;
        }
    }
}