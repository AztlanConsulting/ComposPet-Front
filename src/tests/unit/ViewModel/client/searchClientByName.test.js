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

describe('ClientTableViewModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        getTableUseCase.execute.mockResolvedValue(MOCK_CLIENTS);
        getRoutesUseCase.execute.mockResolvedValue(MOCK_ROUTES);
    });

    it('debe cargar la lista de clientes inicialmente', async () => {
        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.clientList).toHaveLength(3);
        });

        expect(`${result.current.clientList[0].firstName} ${result.current.clientList[0].lastName}`).toBe('Alejandra A');
        expect(`${result.current.clientList[1].firstName} ${result.current.clientList[1].lastName}`).toBe('Leonardo Alvarado');
        expect(`${result.current.clientList[2].firstName} ${result.current.clientList[2].lastName}`).toBe('Andres Arredondo');
    });

    it('debe buscar cliente por nombre correctamente', async () => {
        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.clientList).toHaveLength(3);
        });

        act(() => {
            result.current.setSearchText('leo');
        });

        expect(result.current.clientList).toHaveLength(1);
        expect(`${result.current.clientList[0].firstName} ${result.current.clientList[0].lastName}`).toBe('Leonardo Alvarado');
    });

    it('debe buscar sin distinguir mayúsculas y minúsculas', async () => {
        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.clientList).toHaveLength(3);
        });

        act(() => {
            result.current.setSearchText('ALEJANDRA');
        });

        expect(result.current.clientList).toHaveLength(1);
        expect(`${result.current.clientList[0].firstName} ${result.current.clientList[0].lastName}`).toBe('Alejandra A');
    });

    it('debe retornar lista vacía si no hay clientes que coincidan con el nombre', async () => {
        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.clientList).toHaveLength(3);
        });

        act(() => {
            result.current.setSearchText('Pedro');
        });

        expect(result.current.clientList).toHaveLength(0);
    });

    it('debe filtrar por ruta y nombre al mismo tiempo', async () => {
        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.clientList).toHaveLength(3);
        });

        act(() => {
            result.current.setSelectedRoute('1');
            result.current.setSearchText('andres');
        });

        expect(result.current.clientList).toHaveLength(1);
        expect(`${result.current.clientList[0].firstName} ${result.current.clientList[0].lastName}`).toBe('Andres Arredondo');
    });

    it('debe mostrar todos los clientes si el buscador está vacío y no hay filtro de ruta', async () => {
        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.clientList).toHaveLength(3);
        });

        act(() => {
            result.current.setSearchText('');
            result.current.setSelectedRoute('');
        });

        expect(result.current.clientList).toHaveLength(3);
    });

    it('debe retornar lista vacía si ingresa un emoji', async () => {
        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.clientList).toHaveLength(3);
        });

        act(() => {
            result.current.setSearchText('😀');
        });

        expect(result.current.clientList).toHaveLength(0);
    });

    it('debe retornar lista vacía si ingresa un carácter especial', async () => {
        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.clientList).toHaveLength(3);
        });

        act(() => {
            result.current.setSearchText('%$#');
        });

        expect(result.current.clientList).toHaveLength(0);
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