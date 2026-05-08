import { GetRoutesUseCase } from "../../../domain/useCases/getRoutesUseCase";
import { UpdateClientUseCase } from "../../../domain/useCases/updateClientUseCase";

describe("GetRoutesUseCase", () => {

    test("debe obtener la lista de rutas disponibles", async () => {
        // Arrange
        const mockRoutes = [
            { id_ruta: 1, dia_ruta: "Lunes" },
            { id_ruta: 2, dia_ruta: "Martes" },
        ];

        const mockRepo = {
            getRoutes: jest.fn().mockResolvedValue(mockRoutes),
        };

        const useCase = new GetRoutesUseCase(mockRepo);

        // Act
        const result = await useCase.execute();

        // Assert
        expect(mockRepo.getRoutes).toHaveBeenCalled();
        expect(result).toEqual(mockRoutes);
    });

    test("debe retornar lista vacía si no hay rutas", async () => {
        // Arrange
        const mockRepo = {
            getRoutes: jest.fn().mockResolvedValue([]),
        };

        const useCase = new GetRoutesUseCase(mockRepo);

        // Act
        const result = await useCase.execute();

        // Assert
        expect(mockRepo.getRoutes).toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    test("debe propagar el error si el repositorio falla", async () => {
        // Arrange
        const mockRepo = {
            getRoutes: jest.fn().mockRejectedValue(new Error("DB error")),
        };

        const useCase = new GetRoutesUseCase(mockRepo);

        // Act / Assert
        await expect(useCase.execute()).rejects.toThrow("DB error");
        expect(mockRepo.getRoutes).toHaveBeenCalled();
    });

});

describe("UpdateClientUseCase", () => {

    test("debe actualizar la información del cliente", async () => {
        // Arrange
        const mockUpdatedClient = {
            clientId: "client-123",
            userId: "user-456",
            cellphone: "4421234567",
            balance: 500,
            notes: "Nota actualizada",
            address: "Calle nueva 123",
            pets: "2 gatos",
            family: "2 adultos",
            routeId: 1,
        };

        const mockResponse = { success: true };

        const mockRepo = {
            updateClient: jest.fn().mockResolvedValue(mockResponse),
        };

        const useCase = new UpdateClientUseCase(mockRepo);

        // Act
        const result = await useCase.execute(mockUpdatedClient);

        // Assert
        expect(mockRepo.updateClient).toHaveBeenCalledWith(mockUpdatedClient);
        expect(result).toEqual(mockResponse);
    });

    test("debe propagar el error si el repositorio falla", async () => {
        // Arrange
        const mockRepo = {
            updateClient: jest.fn().mockRejectedValue(new Error("Update failed")),
        };

        const useCase = new UpdateClientUseCase(mockRepo);

        // Act / Assert
        await expect(useCase.execute({ clientId: "client-123" }))
            .rejects.toThrow("Update failed");

        expect(mockRepo.updateClient).toHaveBeenCalled();
    });

});