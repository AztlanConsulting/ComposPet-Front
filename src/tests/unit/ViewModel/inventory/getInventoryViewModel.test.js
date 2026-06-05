import { renderHook, waitFor, act } from '@testing-library/react';
import GetInventoryViewModel from '../../../../presentation/viewmodels/inventory/getInventoryViewModel';
import { getInventoryUseCase } from '../../../../di/inventory/inventoryDependencies';

jest.mock('../../../../di/inventory/inventoryDependencies', () => ({
    getInventoryUseCase: {
        execute: jest.fn(),
    },
}));

describe('GetInventoryViewModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });
    });

    it('debe cargar el inventario correctamente al montar', async () => {
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

        getInventoryUseCase.execute.mockResolvedValue(mockInventory);

        const { result } = renderHook(() => GetInventoryViewModel());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(getInventoryUseCase.execute).toHaveBeenCalledTimes(1);
        expect(result.current.inventory).toEqual(mockInventory);
        expect(result.current.error).toBe(null);
    });

    it('debe regresar error cuando falla el caso de uso', async () => {
        getInventoryUseCase.execute.mockRejectedValue(
            new Error('Error al obtener inventario')
        );

        const { result } = renderHook(() => GetInventoryViewModel());

        await waitFor(() => {
            expect(result.current.error).toBe('Error al obtener inventario');
        });

        expect(getInventoryUseCase.execute).toHaveBeenCalledTimes(1);
        expect(result.current.inventory).toEqual([]);
        expect(result.current.loading).toBe(false);
    });

    it('debe regresar mensaje genérico si el error no tiene message', async () => {
        getInventoryUseCase.execute.mockRejectedValue({});

        const { result } = renderHook(() => GetInventoryViewModel());

        await waitFor(() => {
            expect(result.current.error).toBe(
                'Ocurrió un error al obtener el inventario.'
            );
        });

        expect(result.current.loading).toBe(false);
    });

    it('debe guardar el producto seleccionado al hacer click en una card', async () => {
        getInventoryUseCase.execute.mockResolvedValue([]);

        const mockProduct = {
            productId: 1,
            name: 'Croquetas',
            price: 250,
            quantity: 10,
        };

        const { result } = renderHook(() => GetInventoryViewModel());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        act(() => {
            result.current.onClickCard(mockProduct);
        });

        expect(result.current.selectedProduct).toEqual(mockProduct);
    });

    it('debe permitir limpiar el producto seleccionado', async () => {
        getInventoryUseCase.execute.mockResolvedValue([]);

        const mockProduct = {
            productId: 1,
            name: 'Croquetas',
        };

        const { result } = renderHook(() => GetInventoryViewModel());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        act(() => {
            result.current.onClickCard(mockProduct);
        });

        expect(result.current.selectedProduct).toEqual(mockProduct);

        act(() => {
            result.current.setSelectedProduct(null);
        });

        expect(result.current.selectedProduct).toBe(null);
    });

    it('debe recargar el inventario al llamar loadInventory manualmente', async () => {
        const firstInventory = [
            {
                productId: 1,
                name: 'Croquetas',
            },
        ];

        const secondInventory = [
            {
                productId: 2,
                name: 'Juguete',
            },
        ];

        getInventoryUseCase.execute
            .mockResolvedValueOnce(firstInventory)
            .mockResolvedValueOnce(secondInventory);

        const { result } = renderHook(() => GetInventoryViewModel());

        await waitFor(() => {
            expect(result.current.inventory).toEqual(firstInventory);
        });

        await act(async () => {
            await result.current.loadInventory();
        });

        expect(getInventoryUseCase.execute).toHaveBeenCalledTimes(2);
        expect(result.current.inventory).toEqual(secondInventory);
        expect(result.current.error).toBe(null);
    });

    it('debe detectar pantalla pequeña si window.innerWidth es menor a 768', async () => {
        window.innerWidth = 500;

        getInventoryUseCase.execute.mockResolvedValue([]);

        const { result } = renderHook(() => GetInventoryViewModel());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.isSmall).toBe(true);
    });

    it('debe actualizar isSmall cuando cambia el tamaño de pantalla', async () => {
        getInventoryUseCase.execute.mockResolvedValue([]);

        const { result } = renderHook(() => GetInventoryViewModel());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.isSmall).toBe(false);

        act(() => {
            window.innerWidth = 500;
            window.dispatchEvent(new Event('resize'));
        });

        expect(result.current.isSmall).toBe(true);

        act(() => {
            window.innerWidth = 900;
            window.dispatchEvent(new Event('resize'));
        });

        expect(result.current.isSmall).toBe(false);
    });
});