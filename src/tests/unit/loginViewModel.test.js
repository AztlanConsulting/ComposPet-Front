import { renderHook, act } from "@testing-library/react";
import useLoginViewModel from "../../presentation/viewmodels/auth/loginViewModel";
import { LoginUseCase } from "../../domain/useCases/loginUseCase";

/**
 * Mocks de dependencias externas del ViewModel.
 * Se sustituyen para aislar el hook de navegación, autenticación
 * con Google, parámetros de URL y el caso de uso de login.
 */

jest.mock("axios", () => ({
    create: jest.fn(() => ({
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() }
        }
    }))
}));

jest.mock("@react-oauth/google", () => ({
    useGoogleLogin: () => jest.fn()
}));

// Se conservan las implementaciones reales de react-router-dom y se sobreescriben
// solo los hooks que producirían errores fuera de un contexto de Router
jest.mock("react-router-dom", () => {
    const actual = jest.requireActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => jest.fn(),
        useSearchParams: () => [new URLSearchParams()],
    };
});

jest.mock("../../data/datasources/authApiClient");
jest.mock("../../data/repositories/authRepository");
jest.mock("../../domain/useCases/loginUseCase");
jest.mock("../../api/axiosConfig", () => ({
    setAccessToken: jest.fn()
}));

/**
 * @group ViewModel
 * Suite de pruebas del hook `useLoginViewModel`.
 * Verifica el manejo del estado del formulario, la validación de campos,
 * el flujo de login exitoso y el mapeo de errores del servidor al estado del hook.
 */
describe("useLoginViewModel", () => {
    let mockExecute;

    /**
     * Limpia todos los mocks entre pruebas para evitar que el estado
     * de una prueba afecte a las siguientes.
     */
    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();

        mockExecute = jest.fn();
        LoginUseCase.mockImplementation(() => ({
            execute: mockExecute
        }));
    });

    test("debe validar campos vacíos", async () => {
        const { result } = renderHook(() => useLoginViewModel());

        // Se invoca onSubmit sin haber seteado email ni password
        await act(async () => {
            await result.current.onSubmit({ preventDefault: () => {} });
        });

        expect(result.current.errors.email).toBe("El correo es requerido.");
        expect(result.current.errors.password).toBe("La contraseña es requerida.");
    });

    test("debe hacer login correctamente", async () => {
        mockExecute.mockResolvedValue({
            token: "123",
            id: 1,
            email: "test@test.com",
            rol: "cliente",
            isAdmin: () => false,
            isFirstLogin: () => false,
            isClient: () => true
        });

        const { result } = renderHook(() => useLoginViewModel());

        act(() => {
            result.current.setEmail("test@test.com");
            result.current.setPassword("Password123!");
        });

        await act(async () => {
            await result.current.onSubmit({ preventDefault: () => {} });
        });

        // El token debe persistirse en sessionStorage tras un login exitoso
        expect(mockExecute).toHaveBeenCalled();
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        expect(storedUser.email).toBe("test@test.com");
        expect(storedUser.rol).toBe("cliente");
    });

    test("debe manejar error de credenciales", async () => {
        mockExecute.mockRejectedValue(
            new Error("Credenciales incorrectas")
        );

        const { result } = renderHook(() => useLoginViewModel());

        act(() => {
            result.current.setEmail("test@test.com");
            result.current.setPassword("wrong");
        });

        await act(async () => {
            await result.current.onSubmit({ preventDefault: () => {} });
        });

        // El mensaje "Credenciales" debe asignarse al campo password, no al error general
        expect(result.current.errors.password).toContain("Credenciales");
    });

});