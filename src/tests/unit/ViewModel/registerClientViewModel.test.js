import { renderHook, act } from '@testing-library/react';
import useRegisterClientViewModel from '../../../presentation/viewmodels/admin/registerClientViewModel';

jest.mock('../../../di/admin/registerClientDependencies', () => ({
    registerClientUseCase: {
        execute: jest.fn()
    }
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
}));

jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));

jest.mock("axios", () => ({
    create: jest.fn(() => ({
        interceptors: {
            request: { use: jest.fn(), eject: jest.fn() },
            response: { use: jest.fn(), eject: jest.fn() }
        },
        post: jest.fn(),
        get: jest.fn(),
    }))
}));

jest.mock("../../../api/axiosConfig", () => ({
    __esModule: true,
    default: { post: jest.fn(), get: jest.fn() },
    setAccessToken: jest.fn()
}));
describe('handleSubmit', () => {

    test('no envía si hay errores', async () => {
        const { result } = renderHook(() => useRegisterClientViewModel());

        const fakeEvent = { preventDefault: jest.fn() };

        await act(async () => {
            await result.current.handleSubmit(fakeEvent, {
                selectedDay: null,
                validateDropdowns: () => ({ hasErrors: true, errors: { selectedDay: "error" } }),
                setDropdownErrors: jest.fn()
            });
        });

        // No debería intentar registrar
        const { registerClientUseCase } = require('../../../di/admin/registerClientDependencies');
        expect(registerClientUseCase.execute).not.toHaveBeenCalled();
    });

    test('envía correctamente cuando todo es válido', async () => {
        const { result } = renderHook(() => useRegisterClientViewModel());

        const { registerClientUseCase } = require('../../../di/admin/registerClientDependencies');
        registerClientUseCase.execute.mockResolvedValue({});

        // llenar datos válidos
        act(() => {
            result.current.setName("Juan");
            result.current.setLastName1("Pérez");
            result.current.setEmail("juan@test.com");
            result.current.setPhone("4421234567");
            result.current.setAddress("Calle 123");
        });

        const fakeEvent = { preventDefault: jest.fn() };

        await act(async () => {
            await result.current.handleSubmit(fakeEvent, {
                selectedDay: 1,
                validateDropdowns: () => ({ hasErrors: false }),
                setDropdownErrors: jest.fn()
            });
        });

        expect(registerClientUseCase.execute).toHaveBeenCalled();
    });

    test('maneja error 409 correctamente', async () => {
        const { result } = renderHook(() => useRegisterClientViewModel());

        const { registerClientUseCase } = require('../../../di/admin/registerClientDependencies');
        registerClientUseCase.execute.mockRejectedValue({
            status: 409
        });

        act(() => {
            result.current.setName("Juan");
            result.current.setLastName1("Pérez");
            result.current.setEmail("juan@test.com");
            result.current.setPhone("4421234567");
            result.current.setAddress("Calle 123");
        });

        const fakeEvent = { preventDefault: jest.fn() };

        await act(async () => {
            await result.current.handleSubmit(fakeEvent, {
                selectedDay: 1,
                validateDropdowns: () => ({ hasErrors: false }),
                setDropdownErrors: jest.fn()
            });
        });

        expect(registerClientUseCase.execute).toHaveBeenCalled();
    });

});