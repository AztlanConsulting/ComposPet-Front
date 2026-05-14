import { renderHook, waitFor } from '@testing-library/react';
import useRoutesViewModel from '../../../../presentation/viewmodels/routesInfo/routesTable';
import {
    GetRoutesInfoUseCase,
    GetAvailableWeeksUseCase,
    GetDaysOfRoutesUseCase,
    GetFilteredRoutesUseCase,
} from '../../../../domain/useCases/routesInfo/routesTableUseCase';
import { act } from '@testing-library/react';

jest.mock('../../../../domain/useCases/routesInfo/routesTableUseCase', () => ({
    GetRoutesInfoUseCase:     jest.fn(),
    GetAvailableWeeksUseCase: jest.fn(),
    GetDaysOfRoutesUseCase:   jest.fn(),
    GetFilteredRoutesUseCase: jest.fn(),
}));

describe('useRoutesViewModel', () => {
    let mockExecute;

    beforeEach(() => {
        jest.clearAllMocks();

        mockExecute = jest.fn();

        GetRoutesInfoUseCase.mockImplementation(() => ({
            execute: mockExecute,
        }));
    });

    it('debe regresar la información de las rutas correctamente', async () => {
        const mockRoutes = [
            {
                name: 'Alejandra Arredondo',
                collectedBuckets: 2,
                deliveredBuckets: 3,
                extraProducts: 'Composta',
                schedule: '10:00',
                paymentMethod: 'Efectivo',
                totalToPay: 100,
                totalPaid: 100,
                notes: 'N/A',
            },
        ];

        mockExecute.mockResolvedValue(mockRoutes);

        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(mockExecute).toHaveBeenCalledTimes(1);
        expect(result.current.routesList).toEqual(mockRoutes);
        expect(result.current.error).toBe(null);
    });

    it('debe regresar error cuando falla el caso de uso', async () => {
        mockExecute.mockRejectedValue(
            new Error('Error al cargar la información de rutas')
        );

        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(mockExecute).toHaveBeenCalledTimes(1);
        expect(result.current.routesList).toEqual([]);
        expect(result.current.error).toBe('Error al cargar la información de rutas');
    });

    it('debe regresar la configuración de columnas correctamente', () => {
        mockExecute.mockResolvedValue([]);

        const { result } = renderHook(() => useRoutesViewModel());

        expect(result.current.columnDefinitions).toEqual([
            { headerName: "Nombre", field: "name", width: 200 },
            { headerName: "# Recolección", field: "collectedBuckets", width: 200 },
            { headerName: "# Entrega", field: "deliveredBuckets", width: 200 },
            { headerName: "Productos Extra", field: "extraProducts", width: 200 },
            { headerName: "Horario", field: "schedule", width: 200 },
            { headerName: "Forma de pago", field: "paymentMethod", width: 200 },
            { headerName: "Total a pagar", field: "totalToPay", width: 200 },
            { headerName: "Total pagado", field: "totalPaid", width: 200 },
            { headerName: "Notas", field: "notes", width: 200 },
        ]);

        expect(result.current.defaultColDef).toEqual({
            sortable: true,
            resizable: true,
            tooltipField: "notes",
        });
    });
});

describe('useRoutesViewModel - semanas y días', () => {
    let mockExecuteRoutes, mockExecuteWeeks, mockExecuteDays, mockExecuteFiltered;

    const mockWeeks = [
        { 
            weekStart: '2026-03-01', 
            weekEnd: '2026-03-08', 
            label: '01/03/2026 - 07/03/2026' 
        },
        { 
            weekStart: '2026-03-08', 
            weekEnd: '2026-03-15', 
            label: '08/03/2026 - 14/03/2026' 
        },
    ];

    const mockDays = [
        { 
            id_ruta: 1, 
            dia_ruta: 'Lunes' 
        },
        { 
            id_ruta: 2, 
            dia_ruta: 'Miércoles 1' 
        },
        { 
            id_ruta: 3, 
            dia_ruta: 'Miércoles 2' 
        },
    ];

    const mockRoutes = [{ 
        name: 'Alejandra Arredondo' 
    }];

    beforeEach(() => {
        jest.clearAllMocks();

        mockExecuteRoutes = jest.fn().mockResolvedValue(mockRoutes);
        mockExecuteWeeks = jest.fn().mockResolvedValue(mockWeeks);
        mockExecuteDays = jest.fn().mockResolvedValue(mockDays);
        mockExecuteFiltered = jest.fn().mockResolvedValue(mockRoutes);

        GetRoutesInfoUseCase.mockImplementation(() => (
            { execute: mockExecuteRoutes }
        ));
        GetAvailableWeeksUseCase.mockImplementation(() => (
            { execute: mockExecuteWeeks }
        ));
        GetDaysOfRoutesUseCase.mockImplementation(() => (
            { execute: mockExecuteDays }
        ));
        GetFilteredRoutesUseCase.mockImplementation(() => (
            { execute: mockExecuteFiltered }
        ));
    });

    it('debe cargar semanas al montar', async () => {
        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => {
            expect(result.current.weeks.length).toBeGreaterThan(0);
        });

        expect(mockExecuteWeeks).toHaveBeenCalledTimes(1);
        expect(result.current.weeks[0].label).toMatch(/Semana \d+ - \w+/);
    });

    it('debe cargar días de ruta al montar', async () => {
        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => {
            expect(result.current.daysOfRoutes.length).toBeGreaterThan(0);
        });

        expect(mockExecuteDays).toHaveBeenCalledTimes(1);
        expect(result.current.daysOfRoutes).toEqual(mockDays);
    });

    it('debe llamar getRoutesInfo cuando selectedWeek es null', async () => {
        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(mockExecuteRoutes).toHaveBeenCalled();
        expect(mockExecuteFiltered).not.toHaveBeenCalled();
    });

    it('debe llamar getFilteredRoutes cuando se selecciona una semana', async () => {
        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            result.current.setSelectedWeek(1);
        });

        await waitFor(() => expect(result.current.loading).toBe(false));

        const calls = mockExecuteFiltered.mock.calls;
        const lastCall = calls[calls.length - 1];
        expect(lastCall[0]).toBe(1);
    });

    it('debe llamar getFilteredRoutes con dayName cuando se seleccionan semana y día', async () => {
        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            result.current.setSelectedWeek(1);
            result.current.setSelectedDay('Lunes');
        });

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(mockExecuteFiltered).toHaveBeenCalledWith(1, 'Lunes');
    });

    it('resetFilters debe limpiar selectedWeek y restaurar el día por defecto', async () => {
        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            result.current.setSelectedWeek(2);
            result.current.setSelectedDay('Lunes');
        });

        await act(async () => {
            result.current.resetFilters();
        });

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.selectedWeek).toBe(null);
        expect(mockExecuteRoutes).toHaveBeenCalled();
    });

    it('debe manejar error al cargar semanas', async () => {
        mockExecuteWeeks.mockRejectedValue(new Error('Error semanas'));

        mockExecuteRoutes.mockRejectedValue(new Error('Error semanas'));

        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => {
            expect(result.current.error).toBe('Error semanas');
        });
    });

    it('debe manejar error al cargar días de ruta', async () => {
        mockExecuteDays.mockRejectedValue(new Error('Error días'));

        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBe('Error días');
    });
});