import { LogoutRepository } from '../../data/repositories/logoutRepository';
/**
 * Caso de Uso independiente para el cierre de sesión.
 * Centraliza la lógica de salida del sistema.
 */
export class LogoutUseCase {
    /**
     * @param {import('../../domain/repositories/authInterfaceRepository').AuthIRepository} authRepository
     */
    constructor(repository = null) {
        this.authRepository = repository ?? new LogoutRepository();
    }

    /**
     * Ejecuta el proceso de cierre de sesión.
     * @async
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