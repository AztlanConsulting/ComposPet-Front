import { renderHook, act } from "@testing-library/react";
import { useFirstLoginViewModel } from "../../presentation/viewmodels/auth/firstLoginViewModel";
import ConfirmAlert from '../../components/Template/confirmationAlert';
import TimerAlert from "../../components/Template/timerAlert";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock("../../components/Template/confirmationAlert", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("../../components/Template/timerAlert", () => ({
    __esModule: true,
    default: jest.fn(),
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

jest.mock("../../api/axiosConfig", () => ({
    __esModule: true,
    default: { post: jest.fn(), get: jest.fn() },
    setAccessToken: jest.fn()
}));

jest.mock("../../domain/useCases/firstLoginUseCase");

describe("useFirstLoginViewModel", () => {
    let mockUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        ConfirmAlert.mockResolvedValue({ isConfirmed: true });
        TimerAlert.mockResolvedValue();
        mockUseCase = {
            executeRequest: jest.fn(),
            executeVerify: jest.fn(),
            executeFinalize: jest.fn(),
        };
    });

    test("Flujo completo: debe recorrer los 3 pasos en orden", async () => {
        mockUseCase.executeRequest.mockResolvedValue({ email: "test@test.com", token: "seed-token" });
        mockUseCase.executeVerify.mockResolvedValue({ email: "test@test.com", token: "flow-token" });
        mockUseCase.executeFinalize.mockResolvedValue({ success: true });

        const { result } = renderHook(() => useFirstLoginViewModel(true, mockUseCase));

        // Paso 1
        act(() => { result.current.setEmail("test@test.com"); });
        await act(async () => { await result.current.onRequestOTP({ preventDefault: () => {} }); });
        expect(result.current.step).toBe(2);
        expect(result.current.entity.token).toBe("seed-token");

        // Paso 2
        act(() => { result.current.handleOtpChange({ target: { value: "123456" } }); });
        await act(async () => { await result.current.onVerifyOTP(); });
        expect(result.current.step).toBe(3);
        expect(result.current.entity.token).toBe("flow-token");

        // Paso 3
        act(() => {
            result.current.setP1("Password123!");
            result.current.setP2("Password123!");
        });
        await act(async () => { await result.current.onFinalize(); });
        expect(mockNavigate).toHaveBeenCalledWith("/inicio-sesion");
    });

    test("Fase 1: debe mostrar error si el servidor falla", async () => {
        mockUseCase.executeRequest.mockRejectedValue(new Error("Correo no encontrado"));
        const { result } = renderHook(() => useFirstLoginViewModel(true, mockUseCase));

        act(() => { result.current.setEmail("noexiste@test.com"); });
        await act(async () => { await result.current.onRequestOTP({ preventDefault: () => {} }); });

        expect(result.current.step).toBe(1);
        expect(result.current.error).toBe("Correo no encontrado");
    });

    test("Fase 3: debe mostrar error si la contraseña no cumple criterios", async () => {
        const { result } = renderHook(() => useFirstLoginViewModel(true, mockUseCase));

        act(() => {
            result.current.setP1("corta");
            result.current.setP2("corta");
        });
        await act(async () => { await result.current.onFinalize(); });

        expect(result.current.passwordErrors.password).toContain("12 caracteres");
        expect(mockUseCase.executeFinalize).not.toHaveBeenCalled();
    });
});