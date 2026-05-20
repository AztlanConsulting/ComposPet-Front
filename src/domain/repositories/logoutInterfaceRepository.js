/**
 * Define la estructura esperada para ejecutar el cierre de sesión.
 * Debe ser implementado obligatoriamente por cualquier repositorio concreto.
 * * @async
 * @method logout
 * @returns {Promise<any>} Promesa que debe resolver con la respuesta del proceso de cierre de sesión.
 * @throws {Error} Si el método es invocado directamente sin ser sobreescrito en la capa de infraestructura.
 */
export class logoutIRepository {
    async logout() {
        throw new Error("AuthIRepository.logout() no implementado")
    }
}