export class FirstLoginApiClient {
    /**
     * @param {string} [baseUrl=process.env.REACT_APP_API_URL] - URL base del servidor.
     * Debe configurarse en el archivo `.env` del proyecto.
     */
    constructor(baseUrl = process.env.REACT_APP_API_URL) {
        this.baseUrl = baseUrl;
    }   

    /**
     * Realiza una petición HTTP POST de forma privada al endpoint especificado.
     * Centraliza la configuración de headers, la serialización del cuerpo y el manejo de errores.
     * * @private
     * @async
     * @param {string} endpoint - Ruta relativa al recurso (ej. '/login').
     * @param {Object} body - Objeto con los datos que se enviarán en el cuerpo de la petición.
     * @returns {Promise<Object>} Promesa que resuelve con los datos de la respuesta en formato JSON.
     * @throws {Error} Si la respuesta no es exitosa (status != 2xx), lanza el mensaje del backend o el status code.
     */
    async #post(endpoint, body) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Error en la petición: ${response.status}`);
        }

        return data;
    }

    /**
     * Solicitar código OTP.
     * @param {string} email 
     * @returns {Promise<{success: boolean, seedToken: string}>}
     */
    async requestOTP(email) {
        return await this.#post('/request-otp', { email });
    }

    /**
     * Verificar código OTP con el seedToken.
     * @param {string} email 
     * @param {string} code 
     * @param {string} seedToken 
     * @returns {Promise<{success: boolean, flowToken: string}>}
     */
    async verifyOTP(email, code, seedToken) {
        return await this.#post('/verify-otp', { email, code, seedToken });
    }

    /**
     * Establecer contraseña definitiva usando el flowToken.
     * @param {string} email 
     * @param {string} password 
     * @param {string} flowToken 
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async updatePassword(email, password, flowToken) {
        return await this.#post('/update-password', { email, password, flowToken });
    }
}