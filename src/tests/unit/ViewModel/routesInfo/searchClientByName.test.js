import { renderHook, act, waitFor } from '@testing-library/react';
import useRoutesViewModel from '../../../../presentation/viewmodels/routesInfo/routesTable';

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
    { clientId: '1', name: 'Alejandra A', routeId: 1 },
    { clientId: '2', name: 'Leonardo Alvarado', routeId: 2 },
    { clientId: '3', name: 'Andres Arredondo', routeId: 1 },
];

const MOCK_ROUTES = [
    { id_ruta: 1, dia_ruta: 'Lunes' },
    { id_ruta: 2, dia_ruta: 'Martes' },
];