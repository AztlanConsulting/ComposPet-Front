export class firstLoginIRepository {
    /**
     * @param {string} email
     * @param {bool} isFirstLogin - Bool que nos permite saber si es primer inicio o recuperar contraseña.
     * @returns {Promise<FirstLogin>} Entidad con el seedToken.
     */
    async requestOTP(email, isFirstLogin) {
        throw new Error("Método requestOTP no implementado");
    }

    /**
     * @param {string} email
     * @param {string} code
     * @param {string} seedToken
     * @returns {Promise<FirstLogin>} Entidad con el flowToken.
     */
    async verifyOTP(email, code, seedToken) {
        throw new Error("Método verifyOTP no implementado");
    }

    /**
     * @param {string} email
     * @param {string} password
     * @param {string} flowToken
     * @returns {Promise<Object>} Resultado de la operación.
     */
    async updatePassword(email, password, flowToken) {
        throw new Error("Método updatePassword no implementado");
    }
}