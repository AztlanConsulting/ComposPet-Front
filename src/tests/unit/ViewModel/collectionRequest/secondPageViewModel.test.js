import { renderHook, act, waitFor } from '@testing-library/react';
import useSecondPageViewModel from '../../../../presentation/viewmodels/collectionRequest/secondPageViewModel';

import {
    extraProductsUseCase,
    saveExtraProductsUseCase,
    getLastRequestPerClientUseCase,
    getSelectedExtraProductsUseCase,
} from '../../../../di/collectionRequest/collectionRequestProductsDependencies';

jest.mock(
    '../../../../di/collectionRequest/collectionRequestProductsDependencies',
    () => ({
        extraProductsUseCase: {
            execute: jest.fn(),
        },
        saveExtraProductsUseCase: {
            execute: jest.fn(),
        },
        getLastRequestPerClientUseCase: {
            execute: jest.fn(),
        },
        getSelectedExtraProductsUseCase: {
            execute: jest.fn(),
        },
    })
);

describe('useSecondPageViewModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
    });

    it('debe cargar la información inicial correctamente', async () => {
        getLastRequestPerClientUseCase.execute.mockResolvedValue({
            idRequest: 'req-123',
        });

        extraProductsUseCase.execute.mockResolvedValue([
            {
                idProduct: 1,
                name: 'Composta',
                price: 100,
                description: 'Producto 1',
                quantity: 10,
                imageUrl: 'composta.jpg',
                status: true,
            },
            {
                idProduct: 2,
                name: 'Tierra',
                price: 50,
                description: 'Producto 2',
                quantity: 20,
                imageUrl: 'tierra.jpg',
                status: true,
            },
        ]);

        getSelectedExtraProductsUseCase.execute.mockResolvedValue([
            {
                idProduct: 1,
                quantity: 2,
            },
            {
                idProduct: 2,
                quantity: 1,
            },
        ]);

        const { result } = renderHook(() => useSecondPageViewModel('client-123'));

        await waitFor(() => {
            expect(result.current.requestID).toBe('req-123');
        });

        expect(getLastRequestPerClientUseCase.execute).toHaveBeenCalledWith('client-123');
        expect(extraProductsUseCase.execute).toHaveBeenCalled();
        expect(getSelectedExtraProductsUseCase.execute).toHaveBeenCalledWith('req-123');

        expect(result.current.products).toEqual([
            {
                idProduct: 1,
                name: 'Composta',
                price: 100,
                description: 'Producto 1',
                quantity: 10,
                imageUrl: 'composta.jpg',
                status: true,
            },
            {
                idProduct: 2,
                name: 'Tierra',
                price: 50,
                description: 'Producto 2',
                quantity: 20,
                imageUrl: 'tierra.jpg',
                status: true,
            },
        ]);

        expect(result.current.selectedProducts).toEqual({
            1: 2,
            2: 1,
        });

        expect(result.current.error).toBe('');
        expect(result.current.loading).toBe(false);
    });

    it('debe manejar error al cargar datos', async () => {
        getLastRequestPerClientUseCase.execute.mockRejectedValue(
            new Error('Error al cargar')
        );

        const { result } = renderHook(() => useSecondPageViewModel('client-123'));

        await waitFor(() => {
            expect(result.current.error).toBe('Error al cargar');
        });

        expect(result.current.requestID).toBe('');
        expect(result.current.loading).toBe(false);
        expect(extraProductsUseCase.execute).not.toHaveBeenCalled();
        expect(getSelectedExtraProductsUseCase.execute).not.toHaveBeenCalled();
    });

    it('debe guardar correctamente la segunda sección', async () => {
        getLastRequestPerClientUseCase.execute.mockResolvedValue({
            idRequest: 'req-123',
        });

        extraProductsUseCase.execute.mockResolvedValue([]);

        getSelectedExtraProductsUseCase.execute.mockResolvedValue([
            {
                idProduct: 1,
                quantity: 2,
            },
            {
                idProduct: 2,
                quantity: 1,
            },
        ]);

        saveExtraProductsUseCase.execute.mockResolvedValue({
            message: 'Productos guardados correctamente',
        });

        const { result } = renderHook(() => useSecondPageViewModel('client-123'));

        await waitFor(() => {
            expect(result.current.requestID).toBe('req-123');
        });

        let response;
        await act(async () => {
            response = await result.current.saveSecondSection();
        });

        expect(saveExtraProductsUseCase.execute).toHaveBeenCalledWith('req-123', [
            { id_producto: 1, cantidad: 2 },
            { id_producto: 2, cantidad: 1 },
        ]);

        expect(response).toEqual({
            success: true,
            nextStep: 3,
        });

        expect(result.current.successMessage).toBe('Productos guardados correctamente');
        expect(result.current.error).toBe('');
    });

    it('debe manejar error al guardar productos', async () => {
        getLastRequestPerClientUseCase.execute.mockResolvedValue({
            idRequest: 'req-123',
        });

        extraProductsUseCase.execute.mockResolvedValue([]);

        getSelectedExtraProductsUseCase.execute.mockResolvedValue([
            {
                idProduct: 1,
                quantity: 1,
            },
        ]);

        saveExtraProductsUseCase.execute.mockRejectedValue(
            new Error('Error al guardar productos')
        );

        const { result } = renderHook(() => useSecondPageViewModel('client-123'));

        await waitFor(() => {
            expect(result.current.requestID).toBe('req-123');
        });

        let response;
        await act(async () => {
            response = await result.current.saveSecondSection();
        });

        expect(saveExtraProductsUseCase.execute).toHaveBeenCalledWith('req-123', [
            { id_producto: 1, cantidad: 1 },
        ]);

        expect(response).toEqual({ success: false });
        expect(result.current.error).toBe('Error al guardar productos');
        expect(result.current.loading).toBe(false);
    });
});