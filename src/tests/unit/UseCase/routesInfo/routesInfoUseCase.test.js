import { GetRoutesInfoUseCase } from '../../../../domain/useCases/routesInfo/routesTableUseCase';
import { RoutesRepository } from '../../../../data/repositories/routesInfo/routesRepository';

jest.mock('../../../../data/repositories/routesInfo/routesRepository', () => ({
  RoutesRepository: jest.fn(),
}));

describe('GetRoutesInfoUseCase - execute', () => {
  let mockGetRoutesInfo;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetRoutesInfo = jest.fn();

    RoutesRepository.mockImplementation(() => ({
      getRoutesInfo: mockGetRoutesInfo,
    }));
  });

  it('debe crear el repository al instanciar el use case', () => {
    new GetRoutesInfoUseCase();

    expect(RoutesRepository).toHaveBeenCalledTimes(1);
  });

  it('debe obtener la información de rutas correctamente', async () => {
    const mockRoutes = [
      {
        name: 'Alejandra Arredondo',
        collectedBuckets: 2,
        deliveredBuckets: 3,
      },
    ];

    mockGetRoutesInfo.mockResolvedValue(mockRoutes);

    const useCase = new GetRoutesInfoUseCase();

    const result = await useCase.execute();

    expect(mockGetRoutesInfo).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockRoutes);
  });

  it('debe lanzar el error cuando el repository falla', async () => {
    mockGetRoutesInfo.mockRejectedValue(
      new Error('Error al obtener rutas')
    );

    const useCase = new GetRoutesInfoUseCase();

    await expect(useCase.execute()).rejects.toThrow(
      'Error al obtener rutas'
    );

    expect(mockGetRoutesInfo).toHaveBeenCalledTimes(1);
  });
});