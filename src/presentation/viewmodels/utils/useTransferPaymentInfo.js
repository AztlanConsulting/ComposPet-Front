import { useEffect, useState } from "react";

import { PaymentApiClient } from "../../../data/datasources/payInfoApiClient";
import { PaymentRepository } from "../../../data/repositories/paymentInfo/paymentRepository";
import { GetTransferPaymentInfoUseCase } from "../../../domain/useCases/paymentInfo/getTransferPaymentInfoUseCase";

/**
 * Hook reutilizable para obtener la información
 * de la forma de pago por transferencia.
 *
 * @returns {{
 *  paymentInfo: object|null,
 *  notes: string|null,
 *  loading: boolean,
 *  error: string|null
 * }} Información de la forma de pago por transferencia.
 */
function useTransferPaymentInfo() {
    const [transferPayment, setTransferPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getTransferPaymentInfo = async () => {
            try {
                setLoading(true);
                setError(null);

                const apiClient = new PaymentApiClient();
                const paymentRepository = new PaymentRepository(apiClient);
                const getTransferPaymentInfoUseCase =
                    new GetTransferPaymentInfoUseCase(paymentRepository);

                // Ejecuta el caso de uso.
                const paymentEntity =
                    await getTransferPaymentInfoUseCase.execute();

                // Guarda la entidad en el estado.
                setTransferPayment(paymentEntity);
            } catch (error) {
                console.error(
                    "Error al obtener la información de transferencia",
                    error
                );

                setError(
                    "No pudimos cargar los datos de transferencia. Intenta nuevamente más tarde."
                );
            } finally {
                setLoading(false);
            }
        };

        getTransferPaymentInfo();
    }, []);

    // Utiliza los métodos de la entidad para obtener la información.
    const notes = transferPayment?.getNotes() || "";

    return {
        transferPayment,
        notes,
        loading,
        error,
    };
}

export default useTransferPaymentInfo;