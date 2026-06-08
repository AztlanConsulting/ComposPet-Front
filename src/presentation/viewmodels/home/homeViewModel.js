import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthenticatedClient from '../utils/useAuthenticatedClient';
import useCreditBalance from '../utils/useCreditBalance';
import useTransferPaymentInfo from '../utils/useTransferPaymentInfo';

/**
 * ViewModel de la vista principal del cliente.
 * Obtiene el cliente autenticado, consulta su saldo actual
 * y recupera la información de transferencia.
 *
 * @returns {Object} Estado y acciones para HomeView.
 */
export function useHomeViewModel() {
    const navigate = useNavigate();

    const {
        clientId,
        loading: clientLoading,
        error: clientError,
    } = useAuthenticatedClient();

    const {
        balance,
        loading: creditLoading,
        error: creditError,
    } = useCreditBalance(clientId);

    const {
        transferPayment,
        loading: paymentLoading,
        error: paymentError,
    } = useTransferPaymentInfo();

    const loading = clientLoading || creditLoading || paymentLoading;
    const error = clientError || creditError || paymentError;

    const numericBalance = Number(balance ?? 0);

    const balanceStatus = useMemo(() => {
        if (numericBalance >= 0) {
            return 'positive';
        }

        if (numericBalance <= -500) {
            return 'critical';
        }

        return 'warning';
    }, [numericBalance]);

    const warningMessage = useMemo(() => {
        if (numericBalance < 0) {
            return 'Recuerda liquidar tu saldo lo antes posible';
        }

        return '';
    }, [numericBalance]);

    const formattedBalance = useMemo(() => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(numericBalance);
    }, [numericBalance]);

    const paymentInfo = useMemo(() => {
        return {
            text: transferPayment?.tipo || 'Datos de transferencia',
            notes: transferPayment?.notas || '',
            paymentType: transferPayment?.tipo || 'Transferencia',
        };
    }, [transferPayment]);

    const goToCollectionForm = () => {
        navigate('/formulario-recoleccion');
    };

    return {
        clientId,
        balance: numericBalance,
        formattedBalance,
        balanceStatus,
        warningMessage,
        paymentInfo,
        loading,
        error,
        goToCollectionForm,
    };
}