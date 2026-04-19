import { FirstLoginUseCase } from "../../domain/useCases/firstLoginUseCase";

/**
 * @group UseCase
 * Suite de pruebas unitarias para `FirstLoginUseCase`.
 * Verifica las reglas de negocio puras independientemente de la interfaz de usuario.
 */
describe("FirstLoginUseCase", () => {
    let mockRepo;
    let useCase;

    beforeEach(() => {
        mockRepo = {
            requestOTP: jest.fn(),
            verifyOTP: jest.fn(),
            updatePassword: jest.fn(),
        };
        useCase = new FirstLoginUseCase(mockRepo);
    });

    test("executeRequest debe lanzar error con email inválido", async () => {
        await expect(useCase.executeRequest("correo-sin-arroba"))
            .rejects.toThrow("Email inválido");
    });

    test("executeFinalize debe lanzar error si las contraseñas no coinciden", async () => {
        await expect(useCase.executeFinalize("test@test.com", "Pass123!", "Diferente123!", "token"))
            .rejects.toThrow("MATCH_ERROR");
    });

    test("executeFinalize debe llamar al repositorio con datos correctos", async () => {
        mockRepo.updatePassword.mockResolvedValue({ success: true });
        
        const email = "test@test.com";
        const pass = "PasswordLarga123!";
        const token = "flow-token";

        await useCase.executeFinalize(email, pass, pass, token);

        expect(mockRepo.updatePassword).toHaveBeenCalledWith(email, pass, token);
    });
});