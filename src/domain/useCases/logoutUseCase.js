import { LogoutRepository } from '../../data/repositories/logoutRepository';
/**
 * Caso de Uso para el cierre de sesión.
 * Centraliza la lógica de salida del sistema, interactuando con la capa de datos
 * para invalidar el acceso actual del usuario.
 *
 * @class LogoutUseCase
 */
export class LogoutUseCase {
    /**
     * Crea una instancia de LogoutUseCase.
     * * @param {import('../../domain/repositories/authInterfaceRepository').AuthIRepository|null} [repository=null] - Repositorio de autenticación. Si no se proporciona, se instanciará un `LogoutRepository` por defecto.
     */
    constructor(repository = null) {
        this.authRepository = repository ?? new LogoutRepository();
    }

    /**
     * Ejecuta el proceso de cierre de sesión.
     * Coordina la destrucción de tokens en la API y la limpieza del estado local.
     *
     * @async
     * @throws {Error} Lanza un error de dominio si la operación en el repositorio falla.
     * @returns {Promise<void>}
     */
    async execute() {
        try {
            // Delegamos la destrucción del token (API) y limpieza de memoria al repositorio
            await this.authRepository.logout();
        } catch (error) {
            // Si algo falla, lanzamos un error genérico de dominio
            throw new Error("Error al intentar cerrar la sesión. Inténtalo de nuevo.");
        }
    }
}