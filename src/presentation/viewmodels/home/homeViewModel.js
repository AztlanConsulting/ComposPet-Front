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
        clientName,
        loading: clientLoading,
        error: clientError,
    } = useAuthenticatedClient();

    const {
        balance,
        loading: creditLoading,
        error: creditError,
    } = useCreditBalance(clientId);

    const {
        notes,
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


    const balanceTitle = numericBalance < 0
        ? 'Mi adeudo'
        : 'Mi saldo';

    const warningMessage = useMemo(() => {
        if (numericBalance < 0) {
            return 'Recuerda liquidar tu saldo lo antes posible';
        }

        return '';
    }, [numericBalance]);

    const formattedBalance = useMemo(() => {
        const displayBalance = numericBalance < 0
            ? Math.abs(numericBalance)
            : numericBalance;

        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(displayBalance);
    }, [numericBalance]);

    const paymentInfo = useMemo(() => {
        return {
            text: 'Datos de transferencia',
            notes: notes || '',
            paymentType: 'Transferencia',
        };
    }, [notes]);

    const welcomeName = clientName || 'Cliente';

    const goToCollectionForm = () => {
        navigate('/formulario-recoleccion');
    };

    return {
        clientId,
        welcomeName,
        balance: numericBalance,
        balanceTitle,
        formattedBalance,
        balanceStatus,
        warningMessage,
        paymentInfo,
        loading,
        error,
        goToCollectionForm,
    };
}