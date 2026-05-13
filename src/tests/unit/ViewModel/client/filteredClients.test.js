import { renderHook, act, waitFor } from '@testing-library/react';
import useClientTableViewModel from '../../../../presentation/viewmodels/clientTableViewModel';
import {
    getTableUseCase,
    getRoutesUseCase,
    updateClientUseCase,
} from '../../../../di/admin/clientTableDependencies';

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

describe('ClientTableViewModel', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debe cargar la información de clientes correctamente', async () => {

        getTableUseCase.execute.mockResolvedValue([
            {
                clientId: '1',
                name: 'Cliente Test',
                routeId: 1,
            },
        ]);

        getRoutesUseCase.execute.mockResolvedValue([
            {
                id_ruta: 1,
                dia_ruta: 'Lunes',
            },
        ]);

        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.clientList).toHaveLength(1);
        });

        expect(result.current.clientList[0].name).toBe('Cliente Test');
    });

    it('debe filtrar los clientes por la ruta seleccionada', async () => {
        getTableUseCase.execute.mockResolvedValue([
            {
                clientId: '1',
                name: 'Cliente Lunes',
                routeId: 1,
            },
            {
                clientId: '2',
                name: 'Cliente Martes',
                routeId: 2,
            },
            {
                clientId: '3',
                name: 'Otro Cliente Lunes',
                routeId: 1,
            },
        ]);

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

        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.clientList).toHaveLength(3);
        });

        act(() => {
            result.current.setSelectedRoute(1);
        });

        expect(result.current.clientList).toHaveLength(2);

        expect(
            result.current.clientList.every(
                client => client.routeId === 1
            )
        ).toBe(true);
    });

    it('debe mostrar todos los clientes al seleccionar Sin filtro', async () => {

        getTableUseCase.execute.mockResolvedValue([
            {
                clientId: '1',
                name: 'Cliente Lunes',
                routeId: 1,
            },
            {
                clientId: '2',
                name: 'Cliente Martes',
                routeId: 2,
            },
        ]);

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

        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.clientList).toHaveLength(2);
        });

        act(() => {
            result.current.setSelectedRoute(1);
        });

        expect(result.current.clientList).toHaveLength(1);

        act(() => {
            result.current.setSelectedRoute('');
        });

        expect(result.current.clientList).toHaveLength(2);
    });
});