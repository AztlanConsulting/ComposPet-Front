import { renderHook, waitFor } from '@testing-library/react';

import {
    GetAvailableWeeksUseCase,
    GetDaysOfRoutesUseCase,
    GetFilteredRoutesUseCase,
    GetRoutesInfoUseCase,
    GetDataForEditingRequestUseCase,
    UpdateRequestUseCase,
} from '../../../../domain/useCases/routesInfo/routesTableUseCase';

import useRoutesViewModel from '../../../../presentation/viewmodels/routesInfo/routesTable';

const mockGetAvailableWeeksExecute = jest.fn();
const mockGetDaysOfRoutesExecute = jest.fn();
const mockGetFilteredRoutesExecute = jest.fn();
const mockGetRoutesInfoExecute = jest.fn();
const mockGetDropdownInfoExecute = jest.fn();
const mockUpdateRequestExecute = jest.fn();

jest.mock('../../../../domain/useCases/routesInfo/routesTableUseCase', () => ({
    GetAvailableWeeksUseCase: jest.fn(),
    GetDaysOfRoutesUseCase: jest.fn(),
    GetFilteredRoutesUseCase: jest.fn(),
    GetRoutesInfoUseCase: jest.fn(),
    GetDataForEditingRequestUseCase: jest.fn(),
    UpdateRequestUseCase: jest.fn(),
}));

jest.mock('../../../../presentation/viewmodels/utils/routesTableColumnDefinitions', () => ({
    getRoutesTableColumns: jest.fn(() => []),
}));

jest.mock('../../../../components/Template/ProblemAlert', () => jest.fn());
jest.mock('../../../../components/Template/AceptAlert', () => jest.fn());

describe('Routes Balance Counters ViewModel', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2026-01-05T12:00:00'));

        GetAvailableWeeksUseCase.mockImplementation(() => ({
            execute: mockGetAvailableWeeksExecute,
        }));

        GetDaysOfRoutesUseCase.mockImplementation(() => ({
            execute: mockGetDaysOfRoutesExecute,
        }));

        GetFilteredRoutesUseCase.mockImplementation(() => ({
            execute: mockGetFilteredRoutesExecute,
        }));

        GetRoutesInfoUseCase.mockImplementation(() => ({
            execute: mockGetRoutesInfoExecute,
        }));

        GetDataForEditingRequestUseCase.mockImplementation(() => ({
            execute: mockGetDropdownInfoExecute,
        }));

        UpdateRequestUseCase.mockImplementation(() => ({
            execute: mockUpdateRequestExecute,
        }));

        mockGetAvailableWeeksExecute.mockResolvedValue([
            {
                weekStart: '2026-01-01',
                weekEnd: '2099-01-01',
            },
        ]);

        mockGetDaysOfRoutesExecute.mockResolvedValue([
            {
                dia_ruta: 'Lunes 1',
            },
            {
                dia_ruta: 'Martes 1',
            },
        ]);

        mockGetDropdownInfoExecute.mockResolvedValue({
            payMethods: [],
            extraProducts: [],
        });

        mockGetRoutesInfoExecute.mockResolvedValue([]);
        mockUpdateRequestExecute.mockResolvedValue({});
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('debe calcular la sumatoria total, pagado y pendiente de la ruta actual', async () => {
        mockGetFilteredRoutesExecute.mockImplementation((week, day) => {
            if (day === 'Lunes 1') {
                return Promise.resolve([
                    {
                        name: 'Cliente Ruta Actual 1',
                        totalToPay: 500,
                        totalPaid: 300,
                    },
                    {
                        name: 'Cliente Ruta Actual 2',
                        totalToPay: 200,
                        totalPaid: 100,
                    },
                ]);
            }

            if (day === 'Martes 1') {
                return Promise.resolve([
                    {
                        name: 'Cliente Martes 1',
                        totalToPay: 400,
                        totalPaid: 400,
                    },
                ]);
            }

            return Promise.resolve([
                {
                    name: 'Cliente Ruta Actual 1',
                    totalToPay: 500,
                    totalPaid: 300,
                },
                {
                    name: 'Cliente Ruta Actual 2',
                    totalToPay: 200,
                    totalPaid: 100,
                },
            ]);
        });

        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => {
            expect(mockGetFilteredRoutesExecute).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(result.current.dayTotalAmount).toBe('$700');
            expect(result.current.routePayedAmount).toBe('$400');
            expect(result.current.routePendingAmount).toBe('$300');
        });
    });

    it('debe calcular los contadores semanales usando todos los días de la semana', async () => {
        mockGetFilteredRoutesExecute.mockImplementation((week, day) => {
            if (day === 'Lunes 1') {
                return Promise.resolve([
                    {
                        name: 'Cliente Lunes',
                        totalToPay: 500,
                        totalPaid: 300,
                    },
                ]);
            }

            if (day === 'Martes 1') {
                return Promise.resolve([
                    {
                        name: 'Cliente Martes',
                        totalToPay: 400,
                        totalPaid: 250,
                    },
                ]);
            }

            return Promise.resolve([
                {
                    name: 'Cliente Ruta Actual',
                    totalToPay: 500,
                    totalPaid: 300,
                },
            ]);
        });

        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => {
            expect(mockGetFilteredRoutesExecute).toHaveBeenCalledWith(
                0,
                'Lunes 1'
            );
            expect(mockGetFilteredRoutesExecute).toHaveBeenCalledWith(
                0,
                'Martes 1'
            );
        });

        await waitFor(() => {
            expect(result.current.weeklyPayedAmount).toBe('$550');
            expect(result.current.weeklyPendingAmount).toBe('$350');
        });
    });

    it('debe ignorar pendientes negativos cuando el total pagado supera el total a pagar', async () => {
        mockGetFilteredRoutesExecute.mockImplementation((week, day) => {
            if (day === 'Lunes 1') {
                return Promise.resolve([
                    {
                        name: 'Cliente Lunes',
                        totalToPay: 500,
                        totalPaid: 600,
                    },
                ]);
            }

            if (day === 'Martes 1') {
                return Promise.resolve([
                    {
                        name: 'Cliente Martes',
                        totalToPay: 400,
                        totalPaid: 100,
                    },
                ]);
            }

            return Promise.resolve([
                {
                    name: 'Cliente Ruta Actual',
                    totalToPay: 500,
                    totalPaid: 600,
                },
            ]);
        });

        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => {
            expect(result.current.routePayedAmount).toBe('$600');
            expect(result.current.routePendingAmount).toBe('$0');
            expect(result.current.weeklyPayedAmount).toBe('$700');
            expect(result.current.weeklyPendingAmount).toBe('$300');
        });
    });

    it('debe calcular correctamente valores con formato de moneda', async () => {
        mockGetFilteredRoutesExecute.mockImplementation((week, day) => {
            if (day === 'Lunes 1') {
                return Promise.resolve([
                    {
                        name: 'Cliente Lunes',
                        totalToPay: '$1,000',
                        totalPaid: '$700',
                    },
                ]);
            }

            if (day === 'Martes 1') {
                return Promise.resolve([
                    {
                        name: 'Cliente Martes',
                        totalToPay: '$500',
                        totalPaid: '$200',
                    },
                ]);
            }

            return Promise.resolve([
                {
                    name: 'Cliente Ruta Actual',
                    totalToPay: '$1,000',
                    totalPaid: '$700',
                },
            ]);
        });

        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => {
            expect(result.current.dayTotalAmount).toBe('$1000');
            expect(result.current.routePayedAmount).toBe('$700');
            expect(result.current.routePendingAmount).toBe('$300');
            expect(result.current.weeklyPayedAmount).toBe('$900');
            expect(result.current.weeklyPendingAmount).toBe('$600');
        });
    });
});