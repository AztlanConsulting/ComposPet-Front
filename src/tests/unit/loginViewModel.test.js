import { renderHook, act } from "@testing-library/react";
import useLoginViewModel from "../../presentation/viewmodels/auth/loginViewModel";

// mocks
jest.mock("axios");

jest.mock("@react-oauth/google", () => ({
    useGoogleLogin: () => jest.fn()
}));

jest.mock("react-router-dom", () => {
    const actual = jest.requireActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => jest.fn(),
        useSearchParams: () => [new URLSearchParams()],
    };
});

jest.mock("../../domain/useCases/loginUseCase", () => ({
    LoginUseCase: jest.fn().mockImplementation(() => ({
        execute: jest.fn()
    }))
}));

describe("useLoginViewModel", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe validar campos vacíos", async () => {
    const { result } = renderHook(() => useLoginViewModel());

    await act(async () => {
      await result.current.onSubmit({ preventDefault: () => {} });
    });

    expect(result.current.errors.email).toBe("El correo es requerido.");
    expect(result.current.errors.password).toBe("La contraseña es requerida.");
  });

  test("debe hacer login correctamente", async () => {
    const mockExecute = jest.fn().mockResolvedValue({
      token: "123",
      isAdmin: () => false,
      isFirstLogin: () => false,
      isClient: () => true
    });

    const { LoginUseCase } = require("../../domain/useCases/loginUseCase");
    LoginUseCase.mockImplementation(() => ({
      execute: mockExecute
    }));

    const { result } = renderHook(() => useLoginViewModel());

    act(() => {
      result.current.setEmail("test@test.com");
      result.current.setPassword("1234");
    });

    await act(async () => {
      await result.current.onSubmit({ preventDefault: () => {} });
    });

    expect(mockExecute).toHaveBeenCalled();
    expect(sessionStorage.getItem("token")).toBe("123");
  });

  test("debe manejar error de credenciales", async () => {
    const mockExecute = jest.fn().mockRejectedValue(
      new Error("Credenciales incorrectas")
    );

    const { LoginUseCase } = require("../../domain/useCases/loginUseCase");
    LoginUseCase.mockImplementation(() => ({
      execute: mockExecute
    }));

    const { result } = renderHook(() => useLoginViewModel());

    act(() => {
      result.current.setEmail("test@test.com");
      result.current.setPassword("wrong");
    });

    await act(async () => {
      await result.current.onSubmit({ preventDefault: () => {} });
    });

    expect(result.current.errors.password).toContain("Credenciales");
  });

});