import { LoginUseCase } from "../../domain/useCases/loginUseCase";

/**
 * @group UseCase
 * Suite de pruebas unitarias del caso de uso `LoginUseCase`.
 * Verifica la validación de presencia de credenciales y la correcta
 * delegación al repositorio cuando los datos son válidos.
 * El repositorio se sustituye por un mock para aislar la lógica del caso de uso.
 */
describe("LoginUseCase", () => {

    test("debe lanzar error si email o password están vacíos", async () => {
        const mockRepo = { login: jest.fn() };
        const useCase = new LoginUseCase(mockRepo);

        // El repositorio no debe ser invocado si la validación de presencia falla
        await expect(useCase.execute("", "")).rejects.toThrow(
            "El correo y la contraseña son requeridos."
        );
    });

    test("debe llamar al repositorio si los datos son válidos", async () => {
        const mockUser = { token: "123" };

        const mockRepo = {
            login: jest.fn().mockResolvedValue(mockUser)
        };

        const useCase = new LoginUseCase(mockRepo);

        const result = await useCase.execute("test@test.com", "1234");

        // Se verifica tanto que el repositorio fue llamado con los argumentos correctos
        // como que el caso de uso retorna el usuario sin transformaciones adicionales
        expect(mockRepo.login).toHaveBeenCalledWith("test@test.com", "1234");
        expect(result).toEqual(mockUser);
    });

});