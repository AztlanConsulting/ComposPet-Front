import { RoutesViewModel } from '../../../../presentation/viewmodels/routesInfo/routesTable';
import { GetRoutesInfoUseCase } from '../../../../domain/useCases/routesInfo/routesTableUseCase';

jest.mock('../../../../domain/useCases/routesInfo/routesTableUseCase', () => ({
    GetRoutesInfoUseCase: jest.fn(),
}));

describe('RoutesViewModel - loadRoutesInfo', () => {
    
    let mockExecute;

    beforeEach(() => {
        jest.clearAllMocks();

        mockExecute = jest.fn();

        GetRoutesInfoUseCase.mockImplementation(() => ({
            execute: mockExecute,
        }));
    });

    it('debe regresar la información de las rutas correctamente', async () => {
        const mockRoutes =[
            {
                name: 'Alejandra Arredondo',
                collectedBuckets: 2,
                deliveredBuckets: 3,
                extraProducts: 'Composta',
                route: 'Lunes',
                schedule: '10:00',
                paymentMethod: 'Efectivo',
                totalToPay: 100,
                totalPaid: 100,
                notes: 'N/A',
            },
        ];

        mockExecute.mockResolvedValue(mockRoutes);

        const viewModel = new RoutesViewModel();

        const result = await viewModel.loadRoutesInfo();

        expect(mockExecute).toHaveBeenCalled();
        expect(result).toEqual({
            data: mockRoutes,
        });
    });

    it('debe regresar data vacía y error cuando falla el caso de uso', async () => {
        mockExecute.mockRejectedValue(new Error('Error al cargar la información de rutas'));

        const viewModel = new RoutesViewModel();
        const result = await viewModel.loadRoutesInfo();

        expect(mockExecute).toHaveBeenCalled();
        expect(result).toEqual({
            data: [],
            error: 'Error al cargar la información de rutas',
        });
    });
});