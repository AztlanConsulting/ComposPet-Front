import { renderHook, waitFor } from '@testing-library/react';
import useRoutesViewModel from '../../../../presentation/viewmodels/routesInfo/routesTable';
import { GetRoutesInfoUseCase } from '../../../../domain/useCases/routesInfo/routesTableUseCase';

jest.mock('../../../../domain/useCases/routesInfo/routesTableUseCase', () => ({
    GetRoutesInfoUseCase: jest.fn(),
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
                order: '1',
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
            { headerName: "Orden", field: "order", width: 200},
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