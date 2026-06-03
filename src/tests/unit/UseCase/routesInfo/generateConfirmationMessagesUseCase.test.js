import { GenerateRouteMessagesUseCase } from "../../../../domain/useCases/routesInfo/generateRouteMessagesUseCase";

describe("GenerateRouteMessagesUseCase", () => {
    test("debe generar mensajes de confirmación y retornar la respuesta del repositorio", async () => {
        // Arrange

        //Respuesta moqueada del repositorio
        const mockResponse = {
            success: true,
            message: "Mensajes de confirmación generados exitosamente.",
            data: {
                sheetUrl: "https://docs.google.com/spreadsheets/d/test-sheet-id",
            },
        };

        //Creamos un repositorio falso
        const mockRepo = {
            generateConfirmationMessages: jest.fn().mockResolvedValue(mockResponse),
        };

        //Creamos el caso de uso y le pasamos el repositorio mockeado
        const useCase = new GenerateRouteMessagesUseCase(mockRepo);

        // Actuar con los parámetros de semana y día de ruta
        const result = await useCase.execute(10, "Jueves");

        // Afirmar que el repo fue llamado con los parámetros correctos y que el resultado es el esperado
        expect(mockRepo.generateConfirmationMessages).toHaveBeenCalledWith(
            10,
            "Jueves"
        );

        expect(result).toEqual(mockResponse);
    });

    test("debe retornar success false cuando Revisa que las solicitudes estén completas y agrega un horario a cada una", async () => {
        // Arrange
        const mockResponse = {
            success: false,
            message: "Revisa que las solicitudes estén completas y agrega un horario a cada una",
        };

        const mockRepo = {
            generateConfirmationMessages: jest.fn().mockResolvedValue(mockResponse),
        };

        const useCase = new GenerateRouteMessagesUseCase(mockRepo);

        // Actuar
        const result = await useCase.execute(10, "Jueves");

        // Afirmar
        expect(mockRepo.generateConfirmationMessages).toHaveBeenCalledWith(
            10,
            "Jueves"
        );

        expect(result).toEqual(mockResponse);
    });

    test("debe lanzar error si no se envía weekIndex", async () => {
        // Arrange
        const mockRepo = {
            generateConfirmationMessages: jest.fn(),
        };

        const useCase = new GenerateRouteMessagesUseCase(mockRepo);

        // Actuar y afirmar
        await expect(
            useCase.execute(undefined, "Jueves")
        ).rejects.toThrow("Faltan datos para generar los mensajes de confirmación");

        expect(mockRepo.generateConfirmationMessages).not.toHaveBeenCalled();
    });

    test("debe lanzar error si weekIndex es null", async () => {
        // Arrange
        const mockRepo = {
            generateConfirmationMessages: jest.fn(),
        };

        const useCase = new GenerateRouteMessagesUseCase(mockRepo);

        // Actuar y afirmar
        await expect(
            useCase.execute(null, "Jueves")
        ).rejects.toThrow(
            "Faltan datos para generar los mensajes de confirmación"
        );

        expect(mockRepo.generateConfirmationMessages).not.toHaveBeenCalled();
    });

    test("debe lanzar error si no se envía dayName", async () => {
        // Arrange
        const mockRepo = {
            generateConfirmationMessages: jest.fn(),
        };

        const useCase = new GenerateRouteMessagesUseCase(mockRepo);

        // Actuar y afirmar
        await expect(
            useCase.execute(10, undefined)
        ).rejects.toThrow("Faltan datos para generar los mensajes de confirmación");

        expect(mockRepo.generateConfirmationMessages).not.toHaveBeenCalled();
    });

    test("debe permitir weekIndex igual a 0", async () => {
        // Arrange
        const mockResponse = {
            success: true,
            data: {
                sheetUrl: "https://docs.google.com/spreadsheets/d/test-sheet-id",
            },
        };

        const mockRepo = {
            generateConfirmationMessages: jest.fn().mockResolvedValue(mockResponse),
        };

        const useCase = new GenerateRouteMessagesUseCase(mockRepo);

        // Actuar
        const result = await useCase.execute(0, "Jueves");

        // Afirmar
        expect(mockRepo.generateConfirmationMessages).toHaveBeenCalledWith(
            0,
            "Jueves"
        );
        expect(result).toEqual(mockResponse);
    });
    
    test("debe lanzar error si el repositorio falla", async () => {
        // Arrange
        const mockRepo = {
            generateConfirmationMessages: jest.fn().mockRejectedValue(
                new Error("Error al generar mensajes")
            ),
        };

        const useCase = new GenerateRouteMessagesUseCase(mockRepo);

        // Actuar y afirmar
        await expect(
            useCase.execute(10, "Jueves")
        ).rejects.toThrow("Error al generar mensajes");

        expect(mockRepo.generateConfirmationMessages).toHaveBeenCalledWith(
            10,
            "Jueves"
        );
    });
});