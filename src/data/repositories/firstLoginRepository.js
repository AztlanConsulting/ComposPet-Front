import { FirstLoginIRepository } from "../../domain/repositories/firstLoginInterfaceRepository";
import { FirstLogin } from "../../domain/entities/firstLogin";
import { FirstLoginApiClient } from "../datasources/FirstLoginApiClient";

/**
 * FirstLoginRepository extiende la interfaz definida en el dominio para 
 * implementar la persistencia y consulta de datos de autenticación inicial.
 * @extends FirstLoginIRepository
 */
export class FirstLoginRepository extends FirstLoginIRepository {
    /**
     * @param {Object} apiClient - Instancia del cliente HTTP configurado para realizar las peticiones.
     */
    constructor(){
        super();
        this.apiClient = new FirstLoginApiClient();
    }

    /**
     * Solicita un código OTP al servidor para el correo proporcionado.
     * Mapea la respuesta a una entidad FirstLogin con el estado 'CAN_VERIFY'.
     * @async
     * @param {string} email - Correo electrónico del usuario.
     * @param {bool} isFirstLogin - Bool que nos permite saber si es primer inicio o recuperar contraseña.
     * @returns {Promise<FirstLogin>} Instancia de la entidad con el seedToken necesario.
     * @throws {Error} Propaga errores de red o validación del servidor.
     */
    async requestOTP(email, isFirstLogin) {
        try {
            const data = await this.apiClient.requestOTP(email, isFirstLogin);

            return new FirstLogin({
                email: email, 
                token: data.seedToken,
                step: 'CAN_VERIFY', 
            })
        } catch (error) {
            throw error;
        }
    }

    /**
     * Valida el código OTP ingresado por el usuario.
     * Al tener éxito, eleva el estado de la entidad a 'VERIFIED_STEP'.
     * @async
     * @param {string} email - Correo electrónico del usuario.
     * @param {string} code - Código de 6 dígitos ingresado.
     * @param {string} seedToken - Token de seguridad de la fase previa.
     * @returns {Promise<FirstLogin>} Entidad actualizada con el flowToken de acceso final.
     * @throws {Error} Error si el código es inválido o el token expiró.
     */
    async verifyOTP(email, code, seedToken) {
        try {
            const data = await this.apiClient.verifyOTP(email, code, seedToken);

            return new FirstLogin({
                email: email,
                token: data.flowToken,
                step: 'VERIFIED_STEP', 
            })
        } catch (error) {
            throw error;
        }
    }

    /**
     * Finaliza el flujo actualizando la contraseña del usuario en el sistema.
     * @async
     * @param {string} email - Correo electrónico del usuario.
     * @param {string} password - Nueva contraseña establecida por el usuario.
     * @param {string} flowToken - Token que autoriza el cambio final.
     * @returns {Promise<Object>} Respuesta exitosa del servidor.
     * @throws {Error} Si el token es inválido o el cambio no se puede procesar.
     */
    async updatePassword(email, password, flowToken) {
        try {
            return await this.apiClient.updatePassword(email, password, flowToken);
        } catch (error) {
            throw error;
        }
    }
}