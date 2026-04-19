import { renderHook, act } from "@testing-library/react";
import { useFirstLoginViewModel } from "../../presentation/viewmodels/auth/firstLoginViewModel"
import { FirstLoginUseCase } from "../../domain/useCases/firstLoginUseCase";

/**
 * Mocks de dependencias externas.
 * Se sustituyen las librerías de navegación y comunicación para aislar el ViewModel.
 */
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock("axios", () => ({
    create: jest.fn(() => ({
        interceptors: {
            request: { use: jest.fn(), eject: jest.fn() },
            response: { use: jest.fn(), eject: jest.fn() }
        },
        post: jest.fn(),
        get: jest.fn(),
        put: jest.fn(),
        delete: jest.fn()
    }))
}));

jest.mock("../../api/axiosConfig", () => ({
    __esModule: true,
    default: {
        post: jest.fn(),
        get: jest.fn(),
        create: jest.fn()
    },
    setAccessToken: jest.fn()
}));

jest.mock("../../domain/useCases/firstLoginUseCase");
jest.mock("../../data/datasources/FirstLoginApiClient");
jest.mock("../../data/repositories/firstLoginRepository");

/**
 * @group ViewModel
 * Suite de pruebas para `useFirstLoginViewModel`.
 * Evalúa la transición de estados (pasos 1, 2 y 3) y la lógica de validación de UI.
 */
describe("useFirstLoginViewModel", () => {
    let mockUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        // Setup del mock del UseCase
        mockUseCase = {
            executeRequest: jest.fn(),
            executeVerify: jest.fn(),
            executeFinalize: jest.fn(),
        };
    });

    test("Fase 1: debe avanzar al paso 2 tras solicitar OTP exitosamente", async () => {
        mockUseCase.executeRequest.mockResolvedValue({ email: "test@test.com", token: "seed-token" });
        
        const { result } = renderHook(() => useFirstLoginViewModel(mockUseCase, true));

        act(() => {
            result.current.setEmail("test@test.com");
        });

        await act(async () => {
            await result.current.onRequestOTP({ preventDefault: () => {} });
        });

        expect(result.current.step).toBe(2);
        expect(result.current.entity.token).toBe("seed-token");
    });

    test("Fase 2: debe avanzar al paso 3 si el código OTP es válido", async () => {
        // Simulamos que ya estamos en el paso 2 con un entity previo
        mockUseCase.executeVerify.mockResolvedValue({ email: "test@test.com", token: "flow-token" });
        
        const { result } = renderHook(() => useFirstLoginViewModel(mockUseCase, true));

        // Forzamos estado inicial del paso 2
        act(() => {
            result.current.setEmail("test@test.com");
            result.current.handleOtpChange({ target: { value: "123456" } });
        });

        await act(async () => {
            await result.current.onVerifyOTP();
        });

        expect(result.current.step).toBe(3);
        expect(result.current.error).toBeNull();
    });

    test("Fase 3: debe validar contraseñas y navegar al login al finalizar", async () => {
        mockUseCase.executeFinalize.mockResolvedValue({ success: true });
        
        const { result } = renderHook(() => useFirstLoginViewModel(mockUseCase, true));

        act(() => {
            result.current.setP1("Password123!");
            result.current.setP2("Password123!");
        });

        await act(async () => {
            await result.current.onFinalize();
        });

        // Verificamos que se llamó a la navegación
        expect(mockNavigate).toHaveBeenCalledWith("/inicio-sesion");
    });

    test("debe mostrar error si las contraseñas no cumplen el criterio de 12 caracteres", async () => {
        const { result } = renderHook(() => useFirstLoginViewModel(mockUseCase, true));

        act(() => {
            result.current.setP1("corta");
            result.current.setP2("corta");
        });

        await act(async () => {
            await result.current.onFinalize();
        });

        expect(result.current.passwordErrors.password).toContain("12 caracteres");
        expect(mockUseCase.executeFinalize).not.toHaveBeenCalled();
    });
});