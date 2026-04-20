import { SaveExtraProductsCollection } from "../../../../domain/useCases/saveExtraProductsCollection";

describe("SaveExtraProductsCollection", () => {
  test("debe guardar los productos extra usando el repositorio", async () => {
    // Arrange
    const requestID = "request-123";
    const products = [
      { id_producto: 1, cantidad: 2 },
      { id_producto: 2, cantidad: 1 },
    ];

    const mockResponse = {
      message: "Productos guardados correctamente",
    };

    const mockRepo = {
      saveExtraProducts: jest.fn().mockResolvedValue(mockResponse),
    };

    const useCase = new SaveExtraProductsCollection(mockRepo);

    // Act
    const result = await useCase.execute(requestID, products);

    // Assert
    expect(mockRepo.saveExtraProducts).toHaveBeenCalledWith(requestID, products);
    expect(result).toEqual(mockResponse);
  });
});