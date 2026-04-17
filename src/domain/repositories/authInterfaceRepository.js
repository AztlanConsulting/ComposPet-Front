/**
 * Interfaz abstracta del repositorio de autenticación.
 * Define el contrato que deben cumplir todas las implementaciones
 * concretas del repositorio dentro de la capa de datos.
 *
 * Cualquier clase que extienda esta interfaz debe sobrescribir
 * el método `login`; de lo contrario, lanzará un error en tiempo de ejecución.
 *
 * @abstract
 */

export class AuthIRepository{

    /**
     * Autentica a un usuario con sus credenciales.
     *
     * @abstract
     * @param {string} email - Correo electrónico del usuario.
     * @param {string} password - Contraseña del usuario.
     * @returns {Promise<import('../entities/user').User>} Usuario autenticado.
     * @throws {Error} Siempre, si la subclase no sobrescribe este método.
     */

    async login(email, password){
        throw new Error("AuthIRepository.login() no implementado")
    }

    /**
     * Autentica a un usuario utilizando un token de Google.
     *
     * @abstract
     * @param {string} idToken - Token de acceso proporcionado por Google SDK.
     * @returns {Promise<import('../entities/user').User>} Usuario autenticado.
     * @throws {Error} Siempre, si la subclase no sobrescribe este método.
     */
    async loginWithGoogle(idToken) {
        throw new Error("AuthIRepository.loginWithGoogle() no implementado");
    }
}