import { GetClientUseCase } from "../../../../domain/useCases/getClientUseCase";

describe("GetClientUseCase", () => {
    test("Debe obtener el cliente por id de usuario", async () => {
        //Arrange(Preparar)
        const mockClient = {
            idClient: "clientId",
            userId: "userId",
        };

        const mockRepo = {
            getClientByUserId: jest.fn().mockResolvedValue(mockClient),
        };

        const useCase = new GetClientUseCase(mockRepo);

        //Actuar
        const result = await useCase.execute("userId");

        //Afirmar
        expect(mockRepo.getClientByUserId).toHaveBeenCalledWith("userId");
        expect(result).toEqual(mockClient);
    });

    test("Debe lanzar error si no se envía userId", async () => {
        //Arrange (Preparar)
        const mockRepo = {
            getClientByUserId: jest.fn(),
        };

        const useCase = new GetClientUseCase(mockRepo);

        //Actuar
        await expect(useCase.execute()).rejects.toThrow("Falta el id del usuario");

        //Afirmar
        expect(mockRepo.getClientByUserId).not.toHaveBeenCalled();
    });
});