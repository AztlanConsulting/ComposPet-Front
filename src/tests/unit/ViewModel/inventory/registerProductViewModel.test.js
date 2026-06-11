import { renderHook, act, waitFor } from '@testing-library/react';
import useRegisterProductViewModel from '../../../../presentation/viewmodels/inventory/registerProductViewModel';

import ConfirmAlert from '../../../../components/Template/confirmationAlert';
import AceptAlert from '../../../../components/Template/AceptAlert';
import ProblemAlert from '../../../../components/Template/ProblemAlert';

import { registerProductUseCase } from '../../../../di/inventory/registerProductDependencies';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../../components/Template/confirmationAlert', () => jest.fn());
jest.mock('../../../../components/Template/AceptAlert', () => jest.fn());
jest.mock('../../../../components/Template/ProblemAlert', () => jest.fn());

jest.mock('../../../../di/inventory/registerProductDependencies', () => ({
    registerProductUseCase: {
        execute: jest.fn(),
    },
}));

describe('Unit - ViewModel - useRegisterProductViewModel', () => {
    let mockOnClose;
    let mockOnProductRegistered;

    beforeEach(() => {
        jest.clearAllMocks();
        mockOnClose = jest.fn();
        mockOnProductRegistered = jest.fn();
    });

    it('debe inicializar con valores por defecto', () => {
        const { result } = renderHook(() => useRegisterProductViewModel(mockOnClose));

        expect(result.current.name).toBe('');
        expect(result.current.price).toBe('');
        expect(result.current.quantity).toBe('');
        expect(result.current.color).toBe('#169B49');
        expect(result.current.description).toBe('');
        expect(result.current.imageFile).toBe(null);
        expect(result.current.isPriceFocused).toBe(false);

        expect(result.current.errors).toEqual({
            name: '',
            price: '',
            quantity: '',
            color: '',
            description: '',
            imageFile: '',
        });
    });

    it('debe validar nombre requerido', () => {
        const { result } = renderHook(() => useRegisterProductViewModel(mockOnClose));

        act(() => {
            result.current.validateField('name', '');
        });

        expect(result.current.errors.name).toBe('El nombre del producto es requerido.');
    });

    it('debe validar nombre con caracteres inválidos', () => {
        const { result } = renderHook(() => useRegisterProductViewModel(mockOnClose));

        act(() => {
            result.current.validateField('name', 'Producto@');
        });

        expect(result.current.errors.name).toBe('El nombre contiene caracteres inválidos.');
    });

    it('debe validar precio requerido', () => {
        const { result } = renderHook(() => useRegisterProductViewModel(mockOnClose));

        act(() => {
            result.current.validateField('price', '');
        });

        expect(result.current.errors.price).toBe('El precio es requerido.');
    });

    it('debe validar precio mayor a 100000', () => {
        const { result } = renderHook(() => useRegisterProductViewModel(mockOnClose));

        act(() => {
            result.current.validateField('price', '100001');
        });

        expect(result.current.errors.price).toBe('El precio no puede exceder $100,000.00.');
    });

    it('debe validar cantidad requerida', () => {
        const { result } = renderHook(() => useRegisterProductViewModel(mockOnClose));

        act(() => {
            result.current.validateField('quantity', '');
        });

        expect(result.current.errors.quantity).toBe('La cantidad es requerida.');
    });

    it('debe validar cantidad mayor a 999', () => {
        const { result } = renderHook(() => useRegisterProductViewModel(mockOnClose));

        act(() => {
            result.current.validateField('quantity', '1000');
        });

        expect(result.current.errors.quantity).toBe('La cantidad no puede ser mayor a 999.');
    });

    it('debe validar color inválido', () => {
        const { result } = renderHook(() => useRegisterProductViewModel(mockOnClose));

        act(() => {
            result.current.validateField('color', '#000000');
        });

        expect(result.current.errors.color).toBe('El color seleccionado no es válido.');
    });

    it('debe validar descripción con más de 255 caracteres', () => {
        const { result } = renderHook(() => useRegisterProductViewModel(mockOnClose));

        act(() => {
            result.current.validateField('description', 'a'.repeat(256));
        });

        expect(result.current.errors.description).toBe('La descripción no puede exceder 255 caracteres.');
    });

    it('debe validar imagen con formato inválido', () => {
        const { result } = renderHook(() => useRegisterProductViewModel(mockOnClose));

        const invalidFile = new File(['contenido'], 'archivo.pdf', {
            type: 'application/pdf',
        });

        act(() => {
            result.current.handleImageChange({
                target: {
                    files: [invalidFile],
                },
            });
        });

        expect(result.current.imageFile).toBe(invalidFile);
        expect(result.current.errors.imageFile).toBe('La imagen debe ser JPG, JPEG, SVG, AVIF, HEIC, PNG o WEBP.');
    });

    it('debe validar imagen mayor a 2 MB', () => {
        const { result } = renderHook(() => useRegisterProductViewModel(mockOnClose));

        const largeFile = new File(['x'], 'imagen.png', {
            type: 'image/png',
        });

        Object.defineProperty(largeFile, 'size', {
            value: 2 * 1024 * 1024 + 1,
        });

        act(() => {
            result.current.handleImageChange({
                target: {
                    files: [largeFile],
                },
            });
        });

        expect(result.current.errors.imageFile).toBe('La imagen no puede exceder 2 MB.');
    });

    it('no debe llamar al caso de uso si el formulario tiene errores', async () => {
        const { result } = renderHook(() => useRegisterProductViewModel(mockOnClose));

        await act(async () => {
            await result.current.handleSubmit({
                preventDefault: jest.fn(),
            });
        });

        expect(registerProductUseCase.execute).not.toHaveBeenCalled();
        expect(result.current.errors.name).toBe('El nombre del producto es requerido.');
        expect(result.current.errors.price).toBe('El precio es requerido.');
        expect(result.current.errors.quantity).toBe('La cantidad es requerida.');
    });

    it('debe registrar producto exitosamente y notificar registro', async () => {
        registerProductUseCase.execute.mockResolvedValue({
            productId: 1,
        });
    
        AceptAlert.mockResolvedValue({
            isConfirmed: true,
        });
    
        const { result } = renderHook(() =>
            useRegisterProductViewModel({
                onClose: mockOnClose,
                onProductRegistered: mockOnProductRegistered,
            })
        );
    
        act(() => {
            result.current.setName('Aserrín');
            result.current.setPrice('50.5');
            result.current.setQuantity('10');
            result.current.setColor('#169B49');
            result.current.setDescription('Producto para compostaje');
        });
    
        await act(async () => {
            await result.current.handleSubmit({
                preventDefault: jest.fn(),
            });
        });
    
        expect(registerProductUseCase.execute).toHaveBeenCalledWith({
            name: 'Aserrín',
            price: 50.5,
            quantity: 10,
            color: '#169B49',
            description: 'Producto para compostaje',
            imageFile: null,
        });
    
        expect(AceptAlert).toHaveBeenCalledWith({
            title: 'Producto registrado',
            text: 'El producto se registró exitosamente.',
            confirmText: 'Aceptar',
        });
    
        expect(mockOnClose).not.toHaveBeenCalled();
        expect(mockOnProductRegistered).toHaveBeenCalled();
    });

    it('debe mostrar alerta de producto duplicado si el caso de uso responde 409', async () => {
        registerProductUseCase.execute.mockRejectedValue({
            status: 409,
        });

        const { result } = renderHook(() => useRegisterProductViewModel(mockOnClose));

        act(() => {
            result.current.setName('Aserrín');
            result.current.setPrice('50');
            result.current.setQuantity('10');
            result.current.setColor('#169B49');
        });

        await act(async () => {
            await result.current.handleSubmit({
                preventDefault: jest.fn(),
            });
        });

        expect(ProblemAlert).toHaveBeenCalledWith({
            title: 'Producto ya registrado',
            text: 'Ya existe un producto registrado con este nombre.',
            confirmText: 'Entendido',
        });
    });

    it('debe mostrar alerta genérica si ocurre un error inesperado', async () => {
        registerProductUseCase.execute.mockRejectedValue(new Error('Error'));

        const { result } = renderHook(() => useRegisterProductViewModel(mockOnClose));

        act(() => {
            result.current.setName('Aserrín');
            result.current.setPrice('50');
            result.current.setQuantity('10');
            result.current.setColor('#169B49');
        });

        await act(async () => {
            await result.current.handleSubmit({
                preventDefault: jest.fn(),
            });
        });

        expect(ProblemAlert).toHaveBeenCalledWith({
            title: 'Error',
            text: 'Ocurrió un error inesperado. Intenta de nuevo más tarde.',
            confirmText: 'Entendido',
        });
    });

    it('debe resetear el formulario', () => {
        const { result } = renderHook(() => useRegisterProductViewModel(mockOnClose));

        act(() => {
            result.current.setName('Aserrín');
            result.current.setPrice('100');
            result.current.setQuantity('20');
            result.current.setColor('#42A5E8');
            result.current.setDescription('Texto');
            result.current.setIsPriceFocused(true);
        });

        act(() => {
            result.current.resetForm();
        });

        expect(result.current.name).toBe('');
        expect(result.current.price).toBe('');
        expect(result.current.quantity).toBe('');
        expect(result.current.color).toBe('#169B49');
        expect(result.current.description).toBe('');
        expect(result.current.imageFile).toBe(null);
        expect(result.current.isPriceFocused).toBe(false);
    });

    it('debe cerrar el modal al confirmar cancelación', async () => {
        ConfirmAlert.mockResolvedValue({
            isConfirmed: true,
        });
    
        const { result } = renderHook(() =>
            useRegisterProductViewModel({
                onClose: mockOnClose,
                onProductRegistered: mockOnProductRegistered,
            })
        );
    
        await act(async () => {
            await result.current.cancelForm();
        });
    
        expect(ConfirmAlert).toHaveBeenCalledWith({
            title: '¿Estás seguro que deseas salir del formulario?',
            text: 'Se perderán los cambios no guardados.',
            confirmText: 'Sí, cancelar',
            cancelText: 'Seguir editando',
        });
    
        expect(mockOnClose).toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});