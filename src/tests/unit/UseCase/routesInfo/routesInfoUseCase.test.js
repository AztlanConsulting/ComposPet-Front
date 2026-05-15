import { 
  GetRoutesInfoUseCase, 
  GetAvailableWeeksUseCase, 
  GetDaysOfRoutesUseCase, 
  GetFilteredRoutesUseCase } from '../../../../domain/useCases/routesInfo/routesTableUseCase';
import { RoutesRepository } from '../../../../data/repositories/routesInfo/routesRepository';

jest.mock('../../../../data/repositories/routesInfo/routesRepository', () => ({
  RoutesRepository: jest.fn(),
}));

describe('GetAvailableWeeksUseCase - execute', () => {
    let mockGetAvailableWeeks;

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetAvailableWeeks = jest.fn();
        RoutesRepository.mockImplementation(() => ({
            getAvailableWeeks: mockGetAvailableWeeks,
        }));
    });

    it('debe crear el repository al instanciar', () => {
        new GetAvailableWeeksUseCase();
        expect(RoutesRepository).toHaveBeenCalledTimes(1);
    });

    it('debe retornar las semanas disponibles', async () => {
        const mockWeeks = [
            { weekStart: new Date(), weekEnd: new Date(), label: 'Semana 1 - Mayo' },
        ];
        mockGetAvailableWeeks.mockResolvedValue(mockWeeks);

        const useCase = new GetAvailableWeeksUseCase();
        const result = await useCase.execute();

        expect(mockGetAvailableWeeks).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockWeeks);
    });

    it('debe lanzar error si el repository falla', async () => {
        mockGetAvailableWeeks.mockRejectedValue(new Error('Error semanas'));

        const useCase = new GetAvailableWeeksUseCase();
        await expect(useCase.execute()).rejects.toThrow('Error semanas');
    });
});

describe('GetDaysOfRoutesUseCase - execute', () => {
    let mockGetDaysOfRoutes;

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetDaysOfRoutes = jest.fn();
        RoutesRepository.mockImplementation(() => ({
            getDaysOfRoutes: mockGetDaysOfRoutes,
        }));
    });

    it('debe crear el repository al instanciar', () => {
        new GetDaysOfRoutesUseCase();
        expect(RoutesRepository).toHaveBeenCalledTimes(1);
    });

    it('debe retornar los días de ruta', async () => {
        const mockDays = [
            { 
              id_ruta: 1, 
              dia_ruta: 'Lunes' 
            },
            { 
              id_ruta: 2, 
              dia_ruta: 'Miércoles 1' 
            },
        ];
        mockGetDaysOfRoutes.mockResolvedValue(mockDays);

        const useCase = new GetDaysOfRoutesUseCase();
        const result = await useCase.execute();

        expect(mockGetDaysOfRoutes).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockDays);
    });

    it('debe lanzar error si el repository falla', async () => {
        mockGetDaysOfRoutes.mockRejectedValue(
          new Error('Error días')
        );

        const useCase = new GetDaysOfRoutesUseCase();
        await expect(useCase.execute()).rejects.toThrow('Error días');
    });
});

describe('GetFilteredRoutesUseCase - execute', () => {
    let mockGetFilteredRoutes;

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetFilteredRoutes = jest.fn();
        RoutesRepository.mockImplementation(() => ({
            getFilteredRoutes: mockGetFilteredRoutes,
        }));
    });

    it('debe crear el repository al instanciar', () => {
        new GetFilteredRoutesUseCase();
        expect(RoutesRepository).toHaveBeenCalledTimes(1);
    });

    it('debe retornar las rutas filtradas con weekIndex y dayName', async () => {
        const mockRoutes = [
          { name: 'Alejandra Arredondo' }
        ];
        mockGetFilteredRoutes.mockResolvedValue(mockRoutes);

        const useCase = new GetFilteredRoutesUseCase();
        const result = await useCase.execute(2, 'Lunes');

        expect(mockGetFilteredRoutes).toHaveBeenCalledWith(2, 'Lunes');
        expect(result).toEqual(mockRoutes);
    });

    it('debe retornar rutas filtradas sin dayName', async () => {
        mockGetFilteredRoutes.mockResolvedValue([]);

        const useCase = new GetFilteredRoutesUseCase();
        await useCase.execute(1, undefined);

        expect(mockGetFilteredRoutes).toHaveBeenCalledWith(1, undefined);
    });

    it('debe lanzar error si el repository falla', async () => {
        mockGetFilteredRoutes.mockRejectedValue(new Error('Error filtrado'));

        const useCase = new GetFilteredRoutesUseCase();
        await expect(useCase.execute(0, 'Martes')).rejects.toThrow('Error filtrado');
    });
});

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