import { RegisterProductUseCase } from '../../../../domain/useCases/registerProductUseCase';

describe('Unit - UseCase - RegisterProductUseCase', () => {
    let mockInventoryRepository;
    let useCase;

    beforeEach(() => {
        mockInventoryRepository = {
            registerProduct: jest.fn(),
        };

        useCase = new RegisterProductUseCase(mockInventoryRepository);
    });

    it('debe registrar un producto correctamente', async () => {
        const productData = {
            name: 'Aserrín',
            price: 50,
            description: 'Aserrín natural',
            quantity: 10,
            imageFile: null,
            color: '#169B49',
        };

        const expectedProduct = {
            productId: 1,
            name: 'Aserrín',
            price: 50,
            quantity: 10,
            color: '#169B49',
            status: true,
            deleted: false,
        };

        mockInventoryRepository.registerProduct.mockResolvedValue(expectedProduct);

        const result = await useCase.execute(productData);

        expect(mockInventoryRepository.registerProduct).toHaveBeenCalledWith(productData);
        expect(result).toEqual(expectedProduct);
    });

    it('debe lanzar error si productData es null', async () => {
        await expect(useCase.execute(null)).rejects.toThrow(
            'Faltan datos requeridos para registrar el producto.'
        );

        expect(mockInventoryRepository.registerProduct).not.toHaveBeenCalled();
    });

    it('debe lanzar error si falta el nombre', async () => {
        const productData = {
            price: 50,
            quantity: 10,
            color: '#169B49',
        };

        await expect(useCase.execute(productData)).rejects.toThrow(
            'Faltan datos requeridos para registrar el producto.'
        );

        expect(mockInventoryRepository.registerProduct).not.toHaveBeenCalled();
    });

    it('debe lanzar error si falta el precio', async () => {
        const productData = {
            name: 'Aserrín',
            quantity: 10,
            color: '#169B49',
        };

        await expect(useCase.execute(productData)).rejects.toThrow(
            'Faltan datos requeridos para registrar el producto.'
        );

        expect(mockInventoryRepository.registerProduct).not.toHaveBeenCalled();
    });

    it('debe lanzar error si falta la cantidad', async () => {
        const productData = {
            name: 'Aserrín',
            price: 50,
            color: '#169B49',
        };

        await expect(useCase.execute(productData)).rejects.toThrow(
            'Faltan datos requeridos para registrar el producto.'
        );

        expect(mockInventoryRepository.registerProduct).not.toHaveBeenCalled();
    });

    it('debe lanzar error si falta el color', async () => {
        const productData = {
            name: 'Aserrín',
            price: 50,
            quantity: 10,
        };

        await expect(useCase.execute(productData)).rejects.toThrow(
            'Faltan datos requeridos para registrar el producto.'
        );

        expect(mockInventoryRepository.registerProduct).not.toHaveBeenCalled();
    });

    it('debe permitir precio 0 como dato presente', async () => {
        const productData = {
            name: 'Producto sin costo',
            price: 0,
            quantity: 10,
            color: '#169B49',
        };

        const expectedProduct = {
            productId: 1,
            name: 'Producto sin costo',
            price: 0,
            quantity: 10,
            color: '#169B49',
        };

        mockInventoryRepository.registerProduct.mockResolvedValue(expectedProduct);

        const result = await useCase.execute(productData);

        expect(mockInventoryRepository.registerProduct).toHaveBeenCalledWith(productData);
        expect(result).toEqual(expectedProduct);
    });

    it('debe permitir cantidad 0 como dato presente', async () => {
        const productData = {
            name: 'Producto agotado',
            price: 50,
            quantity: 0,
            color: '#169B49',
        };

        const expectedProduct = {
            productId: 1,
            name: 'Producto agotado',
            price: 50,
            quantity: 0,
            color: '#169B49',
        };

        mockInventoryRepository.registerProduct.mockResolvedValue(expectedProduct);

        const result = await useCase.execute(productData);

        expect(mockInventoryRepository.registerProduct).toHaveBeenCalledWith(productData);
        expect(result).toEqual(expectedProduct);
    });

    it('debe propagar errores del repositorio', async () => {
        const productData = {
            name: 'Aserrín',
            price: 50,
            quantity: 10,
            color: '#169B49',
        };

        mockInventoryRepository.registerProduct.mockRejectedValue(
            new Error('Error del repositorio')
        );

        await expect(useCase.execute(productData)).rejects.toThrow(
            'Error del repositorio'
        );

        expect(mockInventoryRepository.registerProduct).toHaveBeenCalledWith(productData);
    });
});