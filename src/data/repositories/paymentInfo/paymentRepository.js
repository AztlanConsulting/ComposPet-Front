import { PaymentIRepository } from '../../../domain/repositories/paymentInfo/paymentInterfaceRepository';
import { Payment } from '../../../domain/entities/paymentInfo/paymentInfo';

/**
 * Implementación concreta del repositorio de formas de pago.
 * Actúa como adaptador entre el caso de uso y el cliente HTTP,
 * transformando la respuesta de la API en una entidad `Payment`
 * del dominio.
 *
 * @extends PaymentIRepository
 * @see PaymentApiClient
 * @see Payment
 */
export class PaymentRepository extends PaymentIRepository {
    /**
     * Crea una instancia del repositorio de formas de pago.
     *
     * @param {import('../datasources/paymentApiClient').PaymentApiClient} apiClient
     * Cliente HTTP encargado de realizar las peticiones al servidor
     * relacionadas con las formas de pago.
     */
    constructor(apiClient) {
        super();
        this.apiClient = apiClient;
    }

    /**
     * Obtiene la información de la forma de pago por transferencia.
     *
     * @async
     * @returns {Promise<Payment>} Entidad `Payment` con la información
     * de la transferencia.
     * @throws {Error} Si la respuesta no contiene una forma de pago válida.
     */
    async getTransferPaymentInfo() {
        const response = await this.apiClient.getTransferPaymentInfo();

        // Accede al body de la respuesta.
        const data = response.data;

        if (!data) {
            throw new Error(
                'No se encontró la información de pago por transferencia'
            );
        }

        return new Payment({
            notes: data.notas,
        });
    }
}