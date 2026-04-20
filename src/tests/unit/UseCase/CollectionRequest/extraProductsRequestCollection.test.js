import { ExtraProductRequestCollection } from "../../../../domain/useCases/extraProductRequestCollection";

describe("ExtraProductRequestCollection", () => {
  test("debe obtener los productos extra seleccionados de una solicitud", async () => {
    // Arrange
    const mockSelectedProducts = [
      { idProduct: 11, quantity: 2 },
      { idProduct: 2, quantity: 1 },
    ];

    const mockRepo = {
      getInfoAboutExtraProductsSelected: jest.fn().mockResolvedValue(mockSelectedProducts),
    };

    const useCase = new ExtraProductRequestCollection(mockRepo);

    // Act
    const result = await useCase.execute("request-123");

    // Assert
    expect(mockRepo.getInfoAboutExtraProductsSelected).toHaveBeenCalledWith("request-123");
    expect(result).toEqual(mockSelectedProducts);
  });
});