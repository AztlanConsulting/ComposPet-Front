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
     * Obtiene la solicitud de recolección actual del cliente para el rango semanal indicado.
     * Si no existe una solicitud en ese rango, el backend crea una nueva y la retorna.
     *
     * @param {string} idCliente - Id del cliente en formato UUID. si es que existe.
     * @param {string} fechaInicioSemana - Fecha inicial del rango semanal.
     * @param {string} fechaFinSemana - Fecha final del rango semanal.
     * @throws {Error} Si la respuesta HTTP no es exitosa o no regresa JSON válido.
     */

    async obtenerSolicitudRecActual(idCliente, fechaInicioSemana, fechaFinSemana) {

        console.log("Llega al SolicitudesRecApiClient con:", {idCliente, fechaInicioSemana, fechaFinSemana});
        
        const response = await fetch(`${this.baseUrl}/solicitudes_rec/form02/obtener`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({idCliente,fechaInicioSemana,fechaFinSemana})
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener la solicitud de recolección.');
        }

        return data;
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
            console.log("Llega al SolicitudesRecApiClient con:", {
                idSolicitud, 
                quiereRecoleccion, 
                quiereProductosExtra, 
                cubetasRecolectadas, 
                cubetasEntregadas
            });

            const response = await fetch(`${this.baseUrl}/solicitudes_rec/form02/guardar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
}