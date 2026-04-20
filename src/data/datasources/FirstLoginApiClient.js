import api from '../../api/axiosConfig'; 
import { handleHttpError } from '../infrastructure/httpErrorHandler';

export class FirstLoginApiClient {
    /**
     * Solicita un código OTP al correo electrónico proporcionado.
     * * @async
     * @param {string} email - Correo del usuario a validar.
     * @param {bool} isFirstLogin - Bool que nos permite saber si es primer inicio o recuperar contraseña.
     * @returns {Promise<{success: boolean, seedToken: string}>} SeedToken necesario para la verificación.
     * @throws {Error} Si el correo no existe o hay error de red.
     */
    async requestOTP(email, isFirstLogin) {
        try {
            const response = await api.post('/request-otp', { email, isFirstLogin });
            return response.data;
        } catch (error) {
            handleHttpError(error);
        }
    }

    /**
     * Verifica el código OTP ingresado por el usuario utilizando el seedToken previo.
     * * @async
     * @param {string} email - Correo del usuario.
     * @param {string} code - Código OTP de 6 dígitos (normalmente).
     * @param {string} seedToken - Token de seguimiento obtenido en la solicitud.
     * @returns {Promise<{success: boolean, flowToken: string}>} FlowToken necesario para actualizar la contraseña.
     * @throws {Error} Si el código es incorrecto o ha expirado.
     */
    async verifyOTP(email, code, seedToken) {
        try {
            const response = await api.post('/verify-otp', { email, code, seedToken });
            return response.data;
        } catch (error) {
            handleHttpError(error);
        }
    }

    /**
     * Establece la contraseña definitiva del usuario usando el flowToken de validación.
     * * @async
     * @param {string} email - Correo del usuario.
     * @param {string} password - Nueva contraseña.
     * @param {string} flowToken - Token que garantiza que el OTP fue validado con éxito.
     * @returns {Promise<{success: boolean, message: string}>} Confirmación de la operación.
     * @throws {Error} Si el token es inválido o la contraseña no cumple requisitos.
     */
    async updatePassword(email, password, flowToken) {
        try {
            const response = await api.post('/update-password', { email, password, flowToken });
            return response.data;
        } catch (error) {
            handleHttpError(error);
        }
    }
}