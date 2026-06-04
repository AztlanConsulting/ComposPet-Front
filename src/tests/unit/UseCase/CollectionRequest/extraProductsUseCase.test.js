import { ExtraProductsUseCase } from "../../../../domain/useCases/ExtraProducts";

describe("ExtraProductsUseCase", () => {
  test("debe obtener los productos extra desde el repositorio", async () => {
    // Arrange
    const mockProducts = [
      { idProduct: 1, name: "Composta" },
      { idProduct: 2, name: "Tierra" },
    ];

    const mockRepo = {
      getExtraProducts: jest.fn().mockResolvedValue(mockProducts),
    };

    const useCase = new ExtraProductsUseCase(mockRepo);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockRepo.getExtraProducts).toHaveBeenCalled();
    expect(result).toEqual(mockProducts);
  });
});