import { SaveCollectionRequestFirstSectionUseCase } from "../../../../domain/useCases/saveCollectionRequestFirstSectionUseCase";

describe("SaveCollectionRequestFirstSectionUseCase", () => {
    test("Debe guardar la primera sección del formulario", async () => {
        // Arrange
        const mockCollectionRequest = {
            requestId: "requestId",
            wantsCollection: true,
            wantsExtraProducts: false,
            collectedBuckets: 3,
            deliveredBuckets: 1,
        };

        const mockRepo = {
            saveCollectionRequestFirstSection: jest.fn().mockResolvedValue(mockCollectionRequest),
        };

        const useCase = new SaveCollectionRequestFirstSectionUseCase(mockRepo);

        //Actuar
        const result = await useCase.execute(
            "requestId",
            true,
            false,
            3,
            1,
        );

        //Afirmar
        expect(mockRepo.saveCollectionRequestFirstSection).toHaveBeenCalledWith(
            "requestId",
            true,
            false,
            3,
            1,
        );
        expect(result).toEqual(mockCollectionRequest);
    });

    test("debe lanzar error si faltan datos requeridos", async () => {
        //Arrange (Preparar)
        const mockRepo = {
            saveCollectionRequestFirstSection: jest.fn(),
        };

        const useCase = new SaveCollectionRequestFirstSectionUseCase(mockRepo);

        //Actuar
        await expect(useCase.execute()).rejects.toThrow(
            "Faltan datos requeridos para guardar la primera sección de la solicitud.",
        );

        //Afirmar
        expect(mockRepo.saveCollectionRequestFirstSection).not.toHaveBeenCalled();
    });
});