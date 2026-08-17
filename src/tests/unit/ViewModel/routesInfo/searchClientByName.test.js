import { renderHook, act, waitFor } from '@testing-library/react';

import useClientTableViewModel from '../../../../presentation/viewmodels/clientTableViewModel';

import {
    getTableUseCase,
    getRoutesUseCase,
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

const MOCK_CLIENTS = [
    { clientId: '1', firstName: 'Alejandra', lastName: 'A', routeId: 1 },
    { clientId: '2', firstName: 'Leonardo', lastName: 'Alvarado', routeId: 2 },
    { clientId: '3', firstName: 'Andres', lastName: 'Arredondo', routeId: 1 },
];

const MOCK_ROUTES = [
    { id_ruta: 1, dia_ruta: 'Lunes' },
    { id_ruta: 2, dia_ruta: 'Martes' },
];

describe('useClientTableViewModel', () => {

    beforeEach(() => {
        jest.clearAllMocks();

        getTableUseCase.execute.mockResolvedValue(MOCK_CLIENTS);

        getRoutesUseCase.execute.mockResolvedValue(MOCK_ROUTES);
    });

    it('debe cargar clientes inicialmente', async () => {

        const { result } = renderHook(() =>
            useClientTableViewModel()
        );

        await waitFor(() => {
            expect(result.current.clientList).toHaveLength(3);
        });
    });

    it('debe buscar clientes por nombre correctamente', async () => {

        const { result } = renderHook(() =>
            useClientTableViewModel()
        );

        await waitFor(() => {
            expect(result.current.clientList).toHaveLength(3);
        });

        act(() => {
            result.current.handleSearchText('leo');
        });

        expect(result.current.searchText).toBe('leo');

        expect(result.current.clientList).toHaveLength(1);

        expect(`${result.current.clientList[0].firstName} ${result.current.clientList[0].lastName}`)
            .toBe('Leonardo Alvarado');
    });

    it('debe buscar sin distinguir mayúsculas y minúsculas', async () => {

        const { result } = renderHook(() =>
            useClientTableViewModel()
        );

        await waitFor(() => {
            expect(result.current.clientList).toHaveLength(3);
        });

        act(() => {
            result.current.handleSearchText('ALEJANDRA');
        });

        expect(result.current.clientList).toHaveLength(1);

        expect(`${result.current.clientList[0].firstName} ${result.current.clientList[0].lastName}`)
            .toBe('Alejandra A');
    });

    it('debe retornar lista vacía si no hay coincidencias', async () => {

        const { result } = renderHook(() =>
            useClientTableViewModel()
        );

        await waitFor(() => {
            expect(result.current.clientList).toHaveLength(3);
        });

        act(() => {
            result.current.handleSearchText('Pedro');
        });

        expect(result.current.clientList).toHaveLength(0);
    });

    it('no debe actualizar el texto de búsqueda si contiene emojis', async () => {

        const { result } = renderHook(() =>
            useClientTableViewModel()
        );

        await waitFor(() => {
            expect(result.current.clientList).toHaveLength(3);
        });

        act(() => {
            result.current.handleSearchText('Leo😊');
        });

        expect(result.current.searchText).toBe('');

        expect(result.current.clientList).toHaveLength(3);
    });

    it('no debe actualizar el texto de búsqueda si contiene caracteres especiales', async () => {

        const { result } = renderHook(() =>
            useClientTableViewModel()
        );

        await waitFor(() => {
            expect(result.current.clientList).toHaveLength(3);
        });

        act(() => {
            result.current.handleSearchText('Leo@');
        });

        expect(result.current.searchText).toBe('');

        expect(result.current.clientList).toHaveLength(3);
    });
    it('debe retornar lista vacía si ingresa un número', async () => {
        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.clientList).toHaveLength(3);
        });

        act(() => {
            result.current.setSearchText('1');
        });

        expect(result.current.clientList).toHaveLength(0);
    });
});