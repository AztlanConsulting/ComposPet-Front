/**
 * Caso de uso para la autenticación de un usuario.
 * Actúa como intermediario entre el ViewModel y el repositorio,
 * aplicando la validación de presencia antes de delegar al repositorio.
 *
 * @see AuthIRepository
 */
export class LoginUseCase{

    /**
     * @param {import('../../domain/repositories/authInterfaceRepository').AuthIRepository} authRepository
     * - Implementación del repositorio de autenticación.
     */
    constructor(authRepository){
        this.authRepository = authRepository;
    }

    /**
     * Ejecuta la autenticación con las credenciales proporcionadas.
     * Valida que ambos campos estén presentes antes de llamar al repositorio.
     *
     * @param {string} email - Correo electrónico del usuario.
     * @param {string} password - Contraseña del usuario.
     * @returns {Promise<import('../entities/user').User>} Instancia del usuario autenticado con token de sesión.
     * @throws {Error} Si alguno de los campos está vacío o si el repositorio rechaza las credenciales.
     * @see AuthIRepository.login
     */

    async execute(email, password){
        if(!email || !password){
            throw new Error("El correo y la contraseña son requeridos.");
        }

        const user = await this.authRepository.login(email, password)
        return user;
    }
}