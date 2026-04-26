/**
 * Caso de uso para obtener el saldo de un cliente.
 * Actúa como intermediario entre el ViewModel y el repositorio,
 * aplicando la validación de presencia antes de delegar al repositorio.
 *
 * @see ClientIRepository
 */

export class GetCreditBalanceUseCase {
    /**
     * Crea una instancia del caso de uso para obtener el saldo de un cliente.
     *
     * @param {import('../repositories/creditInterfaceRepository').CreditIRepository} creditRepository - Implementación del repositorio de tarjetas.
     */
    constructor(creditRepository) {
        this.creditRepository = creditRepository;
    }

    /**
     * Ejecuta la obtención del saldo del cliente asociado.
     *
     * @async
     * @param {string} clientId - Id del cliente.
     * @returns {Promise<import('../entities/credit').Credit>} Entidad `Credit` encontrada.
     * @throws {Error} Si falta el id del usuario o si el repositorio falla.
     */
    async execute(clientId){
        if(!clientId){
            throw new Error("Falta el id del usuario");
        }

        const credit = await this.creditRepository.getCreditBalance(clientId);
        return credit;
    }
}

