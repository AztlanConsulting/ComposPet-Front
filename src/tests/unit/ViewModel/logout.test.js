import { renderHook, act } from "@testing-library/react";
import { useLogout } from "../../../presentation/viewmodels/auth/logoutViewModel";

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

jest.mock("../../../api/axiosConfig.js", () => ({
    __esModule: true,
    default: { post: jest.fn(), get: jest.fn() },
    setAccessToken: jest.fn()
}));

jest.mock("../../../domain/useCases/logoutUseCase");

/**
 * @group ViewModel
 * Suite de pruebas unitarias para `useLogout`.
 * Verifica que el ViewModel maneja correctamente el flujo de cierre de sesión,
 * limpia el estado local y redirige al usuario.
 */
describe("useLogout", () => {
    let mockUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();

        mockUseCase = {
            execute: jest.fn(),
        };

        // Simular usuario en sessionStorage
        sessionStorage.setItem("user", JSON.stringify({
            id_usuario: "123",
            correo: "test@test.com",
            rol: "cliente"
        }));

        // Mock de window.location.href
        delete window.location;
        window.location = { href: "" };
    });

    test("debe iniciar con el usuario cargado desde sessionStorage", () => {
        const { result } = renderHook(() => useLogout(mockUseCase));

        expect(result.current.user).not.toBeNull();
        expect(result.current.user.correo).toBe("test@test.com");
    });

    test("debe iniciar con user null si sessionStorage está vacío", () => {
        sessionStorage.clear();
        const { result } = renderHook(() => useLogout(mockUseCase));

        expect(result.current.user).toBeNull();
    });

    test("logout exitoso debe limpiar usuario, sessionStorage y redirigir", async () => {
        mockUseCase.execute.mockResolvedValue();

        const { result } = renderHook(() => useLogout(mockUseCase));

        await act(async () => {
            await result.current.logout();
        });

        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
        expect(window.location.href).toBe("/inicio-sesion");
    });

    test("logout debe manejar error del servidor sin romper el flujo", async () => {
        mockUseCase.execute.mockRejectedValue(new Error("Error al intentar cerrar la sesión. Inténtalo de nuevo."));

        const { result } = renderHook(() => useLogout(mockUseCase));

        await act(async () => {
            await result.current.logout();
        });

        // No redirige si falla
        expect(window.location.href).toBe("");
        // El usuario sigue en estado
        expect(result.current.user).not.toBeNull();
    });

    test("isAdmin debe ser true si el rol es Administrador", () => {
        sessionStorage.setItem("user", JSON.stringify({
            id_usuario: "456",
            correo: "admin@test.com",
            rol: "Administrador"
        }));

        const { result } = renderHook(() => useLogout(mockUseCase));

        expect(result.current.isAdmin).toBe(true);
    });

    test("isAdmin debe ser false si el rol es cliente", () => {
        const { result } = renderHook(() => useLogout(mockUseCase));

        expect(result.current.isAdmin).toBe(false);
    });
});
