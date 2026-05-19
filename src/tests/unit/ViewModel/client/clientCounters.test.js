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

import useClientTableViewModel from '../../../../presentation/viewmodels/clientTableViewModel';
import {
    getTableUseCase,
    getRoutesUseCase,
} from '../../../../di/admin/clientTableDependencies';

describe('Client Counters ViewModel', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debe contar solo las familias activas para el total de familias', async () => {
        getTableUseCase.execute.mockResolvedValue([
            {
                clientId: '1',
                name: 'Cliente Activo 1',
                routeId: 1,
                status: true,
            },
            {
                clientId: '2',
                name: 'Cliente Inactivo',
                routeId: 1,
                status: false,
            },
            {
                clientId: '3',
                name: 'Cliente Activo 2',
                routeId: 2,
                status: true,
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
            expect(result.current.totalActiveFamilies).toBe(2);
        });
    });

    it('debe contar las familias activas de acuerdo a la ruta seleccionada', async () => {
        getTableUseCase.execute.mockResolvedValue([
            {
                clientId: '1',
                name: 'Cliente Activo Lunes',
                routeId: 1,
                status: true,
            },
            {
                clientId: '2',
                name: 'Cliente Inactivo Lunes',
                routeId: 1,
                status: false,
            },
            {
                clientId: '3',
                name: 'Cliente Activo Martes',
                routeId: 2,
                status: true,
            },
            {
                clientId: '4',
                name: 'Otro Cliente Activo Lunes',
                routeId: 1,
                status: true,
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
            expect(result.current.totalActiveFamilies).toBe(3);
        });

        act(() => {
            result.current.setSelectedRoute(1);
        });

        expect(result.current.activeFamiliesByRoute).toBe(2);
    });

    it('debe mostrar todas las familias activas por ruta cuando se selecciona Sin filtro', async () => {
        getTableUseCase.execute.mockResolvedValue([
            {
                clientId: '1',
                name: 'Cliente Activo Lunes',
                routeId: 1,
                status: true,
            },
            {
                clientId: '2',
                name: 'Cliente Activo Martes',
                routeId: 2,
                status: true,
            },
            {
                clientId: '3',
                name: 'Cliente Inactivo',
                routeId: 2,
                status: false,
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
            expect(result.current.totalActiveFamilies).toBe(2);
        });

        act(() => {
            result.current.setSelectedRoute(1);
        });

        expect(result.current.activeFamiliesByRoute).toBe(1);

        act(() => {
            result.current.setSelectedRoute('');
        });

        expect(result.current.activeFamiliesByRoute).toBe(2);
    });
});