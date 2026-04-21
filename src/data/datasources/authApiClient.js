import api from '../../api/axiosConfig'; 
import { handleHttpError } from '../infrastructure/httpErrorHandler';

/**
 * Cliente para autenticación. 
 * Su única responsabilidad es la comunicación técnica con el servidor.
 */
export class AuthApiClient {
    
    /**
     * Intenta iniciar sesión con credenciales tradicionales.
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<object>} Datos del usuario y token.
     */
    async login(email, password) {
        try {
            const response = await api.post('/inicio-sesion', { email, password });
            return response.data;

        } catch (error) {
            handleHttpError(error);
        }
    }


    /**
     * Envía el token de acceso de Google al backend de ComposPet.
     * @param {string} googleToken - El token obtenido del SDK de Google.
     * @returns {Promise<object>} Respuesta cruda del backend (id_usuario, token, etc.)
     * Autentica al usuario mediante un token de Google.
     * * @async
     * @param {string} googleToken - Credencial (JWT) obtenida desde el SDK de Google Identity.
     * @returns {Promise<object>} Datos del usuario y token de acceso generado por el backend de ComposPet.
     * @throws {Error} Si el token es inválido o el servidor no puede procesar la solicitud.
     */
    async loginGoogle(googleToken) {
        try {
            const response = await api.post('/auth/google', { token: googleToken });
            return response.data;
        } catch (error) {
            handleHttpError(error);
        }
    }
}