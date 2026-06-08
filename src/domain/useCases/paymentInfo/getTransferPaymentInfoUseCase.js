/**
 * Caso de uso para obtener la información de la forma de pago
 * correspondiente a transferencia.
 *
 * @see PaymentIRepository
 */
export class GetTransferPaymentUseCase {
    /**
     * Crea una instancia del caso de uso para obtener
     *
     * @param {import('../repositories/paymentInterfaceRepository').PaymentIRepository} paymentRepository
     */
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    /**
     * Ejecuta la obtención de la forma de pago de tipo Transferencia.
     *
     * @async
     * @returns {Promise<import('../entities/payment').Payment>} Entidad `Payment` encontrada.
     * @throws {Error} Si no se encuentra la información de transferencia o si el repositorio falla.
     */
    async execute() {

        const payment = await this.paymentRepository.getTransferPayment();

        if (!payment) {
            throw new Error("No se encontró la información de pago por transferencia");
        }

        return payment;
    }
}