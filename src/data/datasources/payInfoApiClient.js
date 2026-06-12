import api from '../../api/axiosConfig';
import { handleHttpError } from '../infrastructure/httpErrorHandler';

/**
 * Cliente HTTP para el módulo de formas de pago de ComposPet.
 * Gestiona la obtención de la información correspondiente
 * a la forma de pago por transferencia.
 */
export class PaymentApiClient {
    /**
     * Obtiene la información de la forma de pago por transferencia.
     *
     * @async
     * @returns {Promise<Object>} Datos de la forma de pago por transferencia.
     * @throws {Error} Si el token es inválido, la solicitud falla
     * o existe un error de red.
     */
    async getTransferPaymentInfo() {
        try {
            const response = await api.get(
                '/formas-pago/consultar-transferencia'
            );

            return response.data;
        } catch (error) {
            return handleHttpError(error);
        }
    }
}