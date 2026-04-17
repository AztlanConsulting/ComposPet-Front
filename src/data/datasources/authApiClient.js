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
     * Envía las credenciales al endpoint `/inicio-sesion` mediante POST.
     * Si el servidor responde con un estado no exitoso, lanza un error
     * con el mensaje provisto por la API o uno genérico como fallback.
     *
     * @param {string} email - Correo electrónico del usuario.
     * @param {string} password - Contraseña del usuario.
     * @returns {Promise<object>} Datos crudos de la respuesta del servidor (id_usuario, correo, rol, token, etc.).
     * @throws {Error} Si la respuesta HTTP no es exitosa (`response.ok === false`).
     */

    async login(email, password){

        const response = await fetch(`${this.baseUrl}/inicio-sesion`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });



        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error(`Error del servidor, inténtalo más tarde.`);
        }

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.message || "Error al iniciar sesión.");
        }

        return data;
    }

    /**
     * Envía el token de acceso de Google al backend de ComposPet.
     * @param {string} googleToken - El token obtenido del SDK de Google.
     * @returns {Promise<object>} Respuesta cruda del backend (id_usuario, token, etc.)
     */
    async loginGoogle(googleToken) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/google`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({ token: googleToken }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error en la autenticación con el servidor.");
            }

            return data; 
        } catch (error) {
            throw error;
        }
    }
}