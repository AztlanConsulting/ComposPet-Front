/**
 * Cliente HTTP para el modulo de los clientes.
 * Realiza las peticiones directamente a la API REST y maneja
 * los errores de respuesta antes de retornar los datos al repositorio.
 *
 * La URL base se obtiene de la variable de entorno `REACT_APP_API_URL`.
 */

export class ClientApiClient {
    
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
     * Obtiene el cliente asociado al id del usuario proporcionado.
     *
     * @async
     * @param {string} userId - Id del usuario.
     * @returns {Promise<Object>} Respuesta JSON del backend con el cliente encontrado.
     * @throws {Error} Si la respuesta HTTP no es exitosa o no regresa JSON válido.
     */
    async getClientByUserId(userId) {

        try {

            // Recupera el token actual para autenticar la petición al backend
            const token = this.getToken();

            // Envía únicamente los datos capturados en la primera sección.
            const response = await fetch(`${this.baseUrl}/cliente/obtener-id-cliente`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({userId}),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener el cliente por id de usuario.');
            }

            return data;
        } catch (error) {
            
            throw error;
        }
    }
}