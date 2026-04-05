/**
 * Cliente HTTP para el servicio de autenticación.
 * Realiza las peticiones directamente a la API REST y maneja
 * los errores de respuesta antes de retornar los datos al repositorio.
 *
 * La URL base se obtiene de la variable de entorno `REACT_APP_API_URL`.
 */
export class AuthApiClient {

    /**
     * @param {string} [baseUrl=process.env.REACT_APP_API_URL] - URL base del servidor.
     * Debe configurarse en el archivo `.env` del proyecto.
     */

    constructor(baseUrl = process.env.REACT_APP_API_URL) {
        this.baseUrl = baseUrl;
    }

    /**
     * Envía las credenciales al endpoint `/login` mediante POST.
     * Si el servidor responde con un estado no exitoso, lanza un error
     * con el mensaje provisto por la API o uno genérico como fallback.
     *
     * @param {string} email - Correo electrónico del usuario.
     * @param {string} password - Contraseña del usuario.
     * @returns {Promise<object>} Datos crudos de la respuesta del servidor (id_usuario, correo, rol, token, etc.).
     * @throws {Error} Si la respuesta HTTP no es exitosa (`response.ok === false`).
     */

    async login(email, password){
        const response = await fetch(`${this.baseUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "aplication/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.message || "Error al iniciar sesión.");
        }

        return data;
    }

}