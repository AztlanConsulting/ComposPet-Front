/**
 * Interfaz abstracta del repositorio de tabla de clientes
 * Define el contrato que deben cumplir todas las implementaciones
 * concretas del repositorio dentro de la capa de datos.
 *
 * @abstract
 */

export class ClientTableIRepository{

    /**
     * Recupera la información de todos los clientes
     *
     * @abstract
     * @returns {Promise<List<import('../entities/clientInfo').ClientInfo>>} Lista de clientes
     * @throws {Error} Siempre, si la subclase no sobrescribe este método.
     */

    async getClientTable(){
        throw new Error("ClientTableIRepository.getClientTable() no implementado")
    }

}