export class firstLoginIRepository {
    /**
     * @param {string} email
     * @returns {Promise<FirstLogin>} Entidad con el seedToken.
     */
    async requestOTP(email) {
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