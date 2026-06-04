import { GetCurrentCollectionRequestUseCase } from "../../../../domain/useCases/getCurrentCollectionRequestUseCase";

describe("GetCurrentCollectionRequestUseCase", () => {
    test("Debe obtener la solicitud actual del cliente", async () => {
        //Arrange (Preparar)
        //Respuesta del repositorio
        const mockCollectionRequest = {
            RequestId: "requestId",
            clientId: "clientId",
        };

        const mockRepo = {
            getCurrentCollectionRequest: jest.fn().mockResolvedValue(mockCollectionRequest),
        };

        const useCase = new GetCurrentCollectionRequestUseCase(mockRepo);

        //Actuar
        const result = await useCase.execute(
            "clientId",
            "2026-04-26T00:00:00.000Z",
            "2026-05-02T23:59:59.999Z",
        );

        //Afirmar
        expect(mockRepo.getCurrentCollectionRequest).toHaveBeenCalledWith(
            "clientId",
            "2026-04-26T00:00:00.000Z",
            "2026-05-02T23:59:59.999Z",
        );
        expect(result).toEqual(mockCollectionRequest);
    });

    test("Debe lanzar error si faltan parámetros requeridos", async () => {
        //Arrange (Preparar)
        const mockRepo = {
            getCurrentCollectionRequest: jest.fn(),
        };

        const useCase = new GetCurrentCollectionRequestUseCase(mockRepo);

        //Actuar
        await expect(useCase.execute()).rejects.toThrow("Faltan parámetros requeridos");

        //Afirmar
        expect(mockRepo.getCurrentCollectionRequest).not.toHaveBeenCalled();
    });
});