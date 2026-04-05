import { AuthIRepository } from "../../domain/repositories/authInterfaceRepository";
import { User } from "../../domain/entities/user";
import axios from 'axios';

/**
 * Implementación concreta del repositorio de autenticación.
 * Actúa como adaptador entre el caso de uso y el cliente HTTP,
 * transformando la respuesta de la API en una entidad `User` del dominio.
 *
 * @extends AuthIRepository
 * @see AuthApiClient
 * @see User
 */
export class AuthRepository extends AuthIRepository{

    /**
     * @param {import('../datasources/authApiClient').AuthApiClient} apiClient
     * - Cliente HTTP que realiza las peticiones al servidor de autenticación.
     */

    constructor(apiClient){
        super();
        this.apiClient = apiClient;
    }

    /**
     * Autentica al usuario contra la API y retorna una entidad de dominio.
     * Mapea los campos de la respuesta del servidor a los atributos de `User`,
     * adaptando la nomenclatura de la API (snake_case) al dominio (camelCase).
     *
     * @param {string} correo - Correo electrónico del usuario.
     * @param {string} password - Contraseña del usuario.
     * @returns {Promise<User>} Instancia de `User` con los datos de sesión.
     * @throws {Error} Si el cliente HTTP falla o la API retorna un error.
     * @see AuthApiClient.login
     */

    async login(email, password){
        const data = await this.apiClient.login(email, password);

        return new User({
            id: data.id_usuario,
            email: data.correo,
            rol: data.rol,
            firstLogin: data.primer_inicio_sesion,
            token: data.token,
        });
    }

    /**
     * Lógica para autenticación con Google.
     * Llama al ApiClient y mapea el resultado a la Entidad User.
     */
    async loginWithGoogle(idToken) {
        try {
            const data = await this.apiClient.loginGoogle(idToken);

            return new User({
                id: data.id_usuario,
                email: data.correo,
                rol: data.rol,
                firstLogin: data.primer_inicio_sesion,
                token: data.token, 
            });
        } catch (error) {
            throw error;
        }
    }
}