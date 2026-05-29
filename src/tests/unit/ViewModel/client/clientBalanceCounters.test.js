import { renderHook, act, waitFor } from '@testing-library/react';

jest.mock('../../../../di/admin/clientTableDependencies', () => ({
    getTableUseCase: {
        execute: jest.fn(),
    },
    getRoutesUseCase: {
        execute: jest.fn(),
    },
    updateClientUseCase: {
        execute: jest.fn(),
    },
}));

jest.mock('../../../../presentation/viewmodels/utils/clientTableColumnDefinitions', () => ({
    getClientTableColumns: jest.fn(() => []),
}));

jest.mock('../../../../components/Template/ProblemAlert', () => jest.fn());
jest.mock('../../../../components/Template/AceptAlert', () => jest.fn());

import useClientTableViewModel from '../../../../presentation/viewmodels/clientTableViewModel';
import {
    getTableUseCase,
    getRoutesUseCase,
} from '../../../../di/admin/clientTableDependencies';

describe('Client Balance Counters ViewModel', () => {

    beforeEach(() => {
        jest.clearAllMocks();

        getRoutesUseCase.execute.mockResolvedValue([
            {
                id_ruta: 1,
                dia_ruta: 'Lunes',
            },
            {
                id_ruta: 2,
                dia_ruta: 'Martes',
            },
        ]);
    });

    it('debe calcular el saldo total positivo y el saldo pendiente negativo', async () => {
        getTableUseCase.execute.mockResolvedValue([
            {
                clientId: '1',
                name: 'Cliente 1',
                routeId: 1,
                balance: 500,
            },
            {
                clientId: '2',
                name: 'Cliente 2',
                routeId: 1,
                balance: -200,
            },
            {
                clientId: '3',
                name: 'Cliente 3',
                routeId: 2,
                balance: 300,
            },
            {
                clientId: '4',
                name: 'Cliente 4',
                routeId: 2,
                balance: -100,
            },
        ]);

        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.totalAmount).toBe('$800');
            expect(result.current.pendingAmount).toBe('- $300');
        });
    });

    it('debe calcular el saldo total y pendiente de acuerdo a la ruta seleccionada', async () => {
        getTableUseCase.execute.mockResolvedValue([
            {
                clientId: '1',
                name: 'Cliente Lunes 1',
                routeId: 1,
                balance: 500,
            },
            {
                clientId: '2',
                name: 'Cliente Lunes 2',
                routeId: 1,
                balance: -200,
            },
            {
                clientId: '3',
                name: 'Cliente Martes 1',
                routeId: 2,
                balance: 300,
            },
            {
                clientId: '4',
                name: 'Cliente Martes 2',
                routeId: 2,
                balance: -100,
            },
        ]);

        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.totalAmount).toBe('$800');
        });

        await act(() => {
            result.current.setSelectedRoute(1);
        });

        expect(result.current.totalAmountPerRoute).toBe('$500');
        expect(result.current.pendingAmountPerRoute).toBe('- $200');

        await act(() => {
            result.current.setSelectedRoute(2);
        });

        expect(result.current.totalAmountPerRoute).toBe('$300');
        expect(result.current.pendingAmountPerRoute).toBe('- $100');
    });

    it('debe regresar $0 cuando la ruta seleccionada no tiene saldos', async () => {
        getTableUseCase.execute.mockResolvedValue([
            {
                clientId: '1',
                name: 'Cliente Lunes',
                routeId: 1,
                balance: 0,
            },
            {
                clientId: '2',
                name: 'Cliente Martes',
                routeId: 2,
                balance: 0,
            },
        ]);

        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.totalAmount).toBe('$0');
            expect(result.current.pendingAmount).toBe('$0');
        });

        act(() => {
            result.current.setSelectedRoute(1);
        });

        expect(result.current.totalAmountPerRoute).toBe('$0');
        expect(result.current.pendingAmountPerRoute).toBe('$0');
    });
});