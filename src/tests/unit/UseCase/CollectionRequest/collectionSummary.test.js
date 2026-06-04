import { DeleteProductSummaryUseCase } from "../../../../domain/useCases/deleteProductSummaryUseCase";
import { GetCollectionSummaryUseCase } from "../../../../domain/useCases/getCollectionSummaryUseCase";
import { UpdateCollectionTotalUseCase } from "../../../../domain/useCases/updateCollectionTotalUseCase";

describe("DeleteProductSummaryUseCase", () => {
  test("debe eliminar un producto del resumen de solicitud", async () => {
    // Arrange
    const mockResponse = {
      success: true,
      message: "Producto eliminado",
    };

    const mockRepo = {
      deleteProduct: jest.fn().mockResolvedValue(mockResponse),
    };

    const useCase = new DeleteProductSummaryUseCase(mockRepo);

    // Act
    const result = await useCase.execute(5, 10, 3);

    // Assert
    expect(mockRepo.deleteProduct).toHaveBeenCalledWith(5, 10, 3);
    expect(result).toEqual(mockResponse);
  });
});

describe("GetCollectionSummaryUseCase", () => {
  test("debe obtener el resumen de la solicitud de recolección", async () => {
    // Arrange
    const mockSummary = {
      collection: {
        id_solicitud: 10,
      },
      products: [
        { id_producto: 1, cantidad: 2 },
      ],
      collectionTotal: 300,
      balance: 150,
      payMethods: [
        { id_pago: 1, metodo: "Efectivo" },
      ],
    };

    const mockRepo = {
      getSummary: jest.fn().mockResolvedValue(mockSummary),
    };

    const useCase = new GetCollectionSummaryUseCase(mockRepo);

    // Act
    const result = await useCase.execute(
      1,
      "2026-04-20",
      "2026-04-26"
    );

    // Assert
    expect(mockRepo.getSummary).toHaveBeenCalledWith(
      1,
      "2026-04-20",
      "2026-04-26"
    );

    expect(result).toEqual(mockSummary);
  });
});

describe("UpdateCollectionTotalUseCase", () => {
  test("debe actualizar el total de la solicitud", async () => {
    // Arrange
    const mockResponse = {
      success: true,
      message: "Total actualizado",
    };

    const mockRepo = {
      updateCollectionTotal: jest.fn().mockResolvedValue(mockResponse),
    };

    const useCase = new UpdateCollectionTotalUseCase(mockRepo);

    // Act
    const result = await useCase.execute(
      10,
      500,
      2,
      "Código de puerta: 1234"
    );

    // Assert
    expect(mockRepo.updateCollectionTotal).toHaveBeenCalledWith(
      10,
      500,
      2,
      "Código de puerta: 1234"
    );

    expect(result).toEqual(mockResponse);
  });
});