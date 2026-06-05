import { GetInventoryUseCase } from '../../../../domain/useCases/inventory/getInventoryUseCase';

describe('GetInventoryUseCase - execute', () => {
    let mockGetInventory;
    let mockInventoryRepository;

    beforeEach(() => {
        jest.clearAllMocks();

        mockGetInventory = jest.fn();

        mockInventoryRepository = {
            getInventory: mockGetInventory,
        };
    });

    it('debe obtener el inventario correctamente', async () => {
        const mockInventory = [
            {
                productId: 1,
                name: 'Croquetas',
                price: 250,
                description: 'Alimento para perro',
                quantity: 10,
                color: 'verde',
                status: true,
                imageUrl: 'croquetas.png',
            },
        ];

        mockGetInventory.mockResolvedValue(mockInventory);

        const useCase = new GetInventoryUseCase(mockInventoryRepository);

        const result = await useCase.execute();

        expect(mockGetInventory).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockInventory);
    });

    it('debe retornar arreglo vacío si no hay productos', async () => {
        mockGetInventory.mockResolvedValue([]);

        const useCase = new GetInventoryUseCase(mockInventoryRepository);

        const result = await useCase.execute();

        expect(mockGetInventory).toHaveBeenCalledTimes(1);
        expect(result).toEqual([]);
    });

    it('debe lanzar error si el repository falla', async () => {
        mockGetInventory.mockRejectedValue(
            new Error('Error al obtener inventario')
        );

        const useCase = new GetInventoryUseCase(mockInventoryRepository);

        await expect(useCase.execute()).rejects.toThrow(
            'Error al obtener inventario'
        );

        expect(mockGetInventory).toHaveBeenCalledTimes(1);
    });
});