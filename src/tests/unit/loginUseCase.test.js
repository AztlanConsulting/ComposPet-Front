import { LoginUseCase } from "../../domain/useCases/loginUseCase";

describe("LoginUseCase", () => {

    test("debe lanzar error si email o password están vacíos", async () => {
        const mockRepo = { login: jest.fn() };
        const useCase = new LoginUseCase(mockRepo);

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

        expect(mockRepo.login).toHaveBeenCalledWith("test@test.com", "1234");
        expect(result).toEqual(mockUser);
    });

});