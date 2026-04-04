
export class LoginUseCase{

    constructor(authRepository){
        this.authRepository = authRepository;
    }

    /**
     * Ejecuta el caso de uso de login.
     *
     * @param {string} correo
     * @param {string} password
     * @returns {Promise<import('../entities/User').User>}
     * @throws {Error} mensaje para el usuario si falla
     */

    async execute(email, password){
        if(!email || !password){
            throw new Error("El correo y la contraseña son requeridos.");
        }

        const user = await this.authRepository.login(email, password)
        return user;
    }
}