import { LogoutUseCase } from "../../../domain/useCases/logoutUseCase";

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

jest.mock("../../../data/repositories/logoutRepository.js", () => ({
    LogoutRepository: jest.fn().mockImplementation(() => ({
        logout: jest.fn(),
    }))
}));

jest.mock("../../../api/axiosConfig.js", () => ({
    __esModule: true,
    default: { post: jest.fn(), get: jest.fn() },
    setAccessToken: jest.fn()
}));

/**
 * @group UseCase
 * Suite de pruebas unitarias para `LogoutUseCase`.
 * Verifica que el caso de uso delega correctamente al repositorio
 * y maneja errores sin exponer detalles internos.
 */
describe("LogoutUseCase", () => {
    let mockRepo;
    let useCase;

    beforeEach(() => {
        mockRepo = {
            logout: jest.fn(),
        };
        useCase = new LogoutUseCase(mockRepo);
    });

    test("execute debe llamar al repositorio logout correctamente", async () => {
        mockRepo.logout.mockResolvedValue({ message: "Session closed successfully." });

        await useCase.execute();

        expect(mockRepo.logout).toHaveBeenCalledTimes(1);
    });

    test("execute debe lanzar error genérico si el repositorio falla", async () => {
        mockRepo.logout.mockRejectedValue(new Error("Network error"));

        await expect(useCase.execute())
            .rejects.toThrow("Error al intentar cerrar la sesión. Inténtalo de nuevo.");
    });
});