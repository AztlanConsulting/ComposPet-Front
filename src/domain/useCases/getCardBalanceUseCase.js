/**
 * Caso de uso para obtener el saldo de un cliente.
 * Actúa como intermediario entre el ViewModel y el repositorio,
 * aplicando la validación de presencia antes de delegar al repositorio.
 *
 * @see ClientIRepository
 */

export class GetCardBalanceUseCase {
    /**
     * Crea una instancia del caso de uso para obtener el saldo de un cliente.
     *
     * @param {import('../repositories/cardInterfaceRepository').CardIRepository} cardRepository - Implementación del repositorio de tarjetas.
     */
    constructor(cardRepository) {
        this.cardRepository = cardRepository;
    }

    /**
     * Ejecuta la obtención del saldo del cliente asociado.
     *
     * @async
     * @param {string} clientId - Id del cliente.
     * @returns {Promise<import('../entities/card').Card>} Entidad `Card` encontrada.
     * @throws {Error} Si falta el id del usuario o si el repositorio falla.
     */
    async execute(clientId){
        if(!clientId){
            throw new Error("Falta el id del usuario");
        }

        const card = await this.cardRepository.getCardBalance(clientId);
        return card;
    }
}

