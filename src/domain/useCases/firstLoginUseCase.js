/**
 * @class FirstLoginUseCase
 * @description Orquestador de la lógica de aplicación para el flujo de activación.
 * Se encarga de validar los datos de entrada antes de delegar la persistencia al repositorio.
 */
export class FirstLoginUseCase{

    /**
     * @param {firstLoginIRepository} firstLoginRepository - Implementación del repositorio de activación.
     */
    constructor(firstLoginRepository) {
        this.repository = firstLoginRepository;
    }

    /**
     * Inicia el proceso de recuperación/activación solicitando un OTP.
     * @async
     * @param {string} email - Correo del usuario a validar.
     * @throws {Error} Si el formato del correo es incorrecto.
     * @returns {Promise<FirstLogin>} Entidad con el estado inicial del flujo.
     */
    async executeRequest(email) {
        if (!email.includes('@')) throw new Error("Email inválido");
        return await this.repository.requestOTP(email);
    }

    /**
     * Valida el código ingresado contra el repositorio.
     * @async
     * @param {string} email - Correo del usuario.
     * @param {string} code - Código de 6 dígitos.
     * @param {string} seedToken - Token de sesión de la fase 1.
     * @throws {Error} Si el código no cumple con la longitud requerida.
     * @returns {Promise<FirstLogin>} Entidad con el estado verificado.
     */
    async executeVerify(email, code, seedToken) {
        if (code.length !== 6) throw new Error("El código debe ser de 6 dígitos");
        return await this.repository.verifyOTP(email, code, seedToken);
    }

    /**
     * Finaliza el flujo actualizando la contraseña del usuario.
     * Aplica validaciones de coincidencia y longitud de seguridad (12 caracteres).
     * @async
     * @param {string} email - Correo del usuario.
     * @param {string} password - Nueva contraseña.
     * @param {string} confirmPassword - Confirmación de la nueva contraseña.
     * @param {string} flowToken - Token de sesión de la fase 2.
     * @throws {Error} Si las contraseñas no coinciden o no cumplen los 12 caracteres.
     * @returns {Promise<Object>} Resultado de la operación en el servidor.
     */
    async executeFinalize(email, password, confirmPassword,  flowToken) {
        if (password !== confirmPassword) throw new Error("MATCH_ERROR");
        if (password.length < 8) throw new Error("La contraseña es muy corta");
        return await this.repository.updatePassword(email, password, flowToken);
    }
}