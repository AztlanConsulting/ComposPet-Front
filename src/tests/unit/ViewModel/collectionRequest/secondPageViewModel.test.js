import { renderHook, act, waitFor } from "@testing-library/react";
import useSecondPageViewModel from "../../../../presentation/viewmodels/collectionRequest/secondPageViewModel";

import { ExtraProductsUseCase } from "../../../../domain/useCases/ExtraProducts";
import { SaveExtraProductsCollection } from "../../../../domain/useCases/saveExtraProductsCollection";
import { GetLastRequestPerClient } from "../../../../domain/useCases/getLastRequestPerClient";
import { ExtraProductRequestCollection } from "../../../../domain/useCases/extraProductRequestCollection";

jest.mock("../../../../data/datasources/collectionRequestApiClient", () => ({
  CollectionRequestApiClient: jest.fn(),
}));

jest.mock("../../../../data/repositories/collectionRequestRepository", () => ({
  CollectionRequestRepository: jest.fn(),
}));

jest.mock("../../../../domain/useCases/ExtraProducts");
jest.mock("../../../../domain/useCases/saveExtraProductsCollection");
jest.mock("../../../../domain/useCases/getLastRequestPerClient");
jest.mock("../../../../domain/useCases/extraProductRequestCollection");

describe("useSecondPageViewModel", () => {
  let mockGetExtraProductsExecute;
  let mockSaveExtraProductsExecute;
  let mockGetLastRequestExecute;
  let mockGetSelectedExtraProductsExecute;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetExtraProductsExecute = jest.fn();
    mockSaveExtraProductsExecute = jest.fn();
    mockGetLastRequestExecute = jest.fn();
    mockGetSelectedExtraProductsExecute = jest.fn();

    ExtraProductsUseCase.mockImplementation(() => ({
      execute: mockGetExtraProductsExecute,
    }));

    SaveExtraProductsCollection.mockImplementation(() => ({
      execute: mockSaveExtraProductsExecute,
    }));

    GetLastRequestPerClient.mockImplementation(() => ({
      execute: mockGetLastRequestExecute,
    }));

    ExtraProductRequestCollection.mockImplementation(() => ({
      execute: mockGetSelectedExtraProductsExecute,
    }));
  });

  test("debe cargar la información inicial correctamente", async () => {
    // Arrange
    mockGetLastRequestExecute.mockResolvedValue({ idRequest: "req-123" });

    mockGetExtraProductsExecute.mockResolvedValue([
      { idProduct: 1, name: "Composta" },
      { idProduct: 2, name: "Tierra" },
    ]);

    mockGetSelectedExtraProductsExecute.mockResolvedValue([
      { idProduct: 1, quantity: 2 },
      { idProduct: 2, quantity: 1 },
    ]);

    // Act
    const { result } = renderHook(() => useSecondPageViewModel("client-1"));

    await waitFor(() => {
      expect(result.current.requestID).toBe("req-123");
    });

    // Assert
    expect(mockGetLastRequestExecute).toHaveBeenCalledWith("client-1");
    expect(mockGetExtraProductsExecute).toHaveBeenCalled();
    expect(mockGetSelectedExtraProductsExecute).toHaveBeenCalledWith("req-123");

    expect(result.current.products).toEqual([
      { idProduct: 1, name: "Composta" },
      { idProduct: 2, name: "Tierra" },
    ]);

    expect(result.current.selectedProducts).toEqual({
      1: 2,
      2: 1,
    });

    expect(result.current.error).toBe("");
    expect(result.current.loading).toBe(false);
  });

  test("no debe cargar datos si no hay idClient", async () => {
    // Act
    const { result } = renderHook(() => useSecondPageViewModel(""));

    // Assert
    await waitFor(() => {
      expect(result.current.requestID).toBe("");
    });

    expect(mockGetLastRequestExecute).not.toHaveBeenCalled();
    expect(mockGetExtraProductsExecute).not.toHaveBeenCalled();
    expect(mockGetSelectedExtraProductsExecute).not.toHaveBeenCalled();
  });

  test("debe manejar error al cargar datos", async () => {
    // Arrange
    mockGetLastRequestExecute.mockRejectedValue(new Error("Error al cargar"));

    // Act
    const { result } = renderHook(() => useSecondPageViewModel("client-1"));

    // Assert
    await waitFor(() => {
      expect(result.current.error).toBe("Error al cargar");
    });

    expect(result.current.loading).toBe(false);
  });

  test("debe agregar un producto al selectedProducts", () => {
    const { result } = renderHook(() => useSecondPageViewModel("client-1"));

    act(() => {
      result.current.addProduct(5, "Humus");
    });

    expect(result.current.selectedProducts).toEqual({
      5: 1,
    });
  });

  test("debe incrementar la cantidad si el producto ya existe", () => {
    const { result } = renderHook(() => useSecondPageViewModel("client-1"));

    act(() => {
      result.current.addProduct(5, "Humus");
      result.current.addProduct(5, "Humus");
    });

    expect(result.current.selectedProducts).toEqual({
      5: 2,
    });
  });

  test("debe activar message y agregar el nombre al seleccionar producto especial", () => {
    const { result } = renderHook(() => useSecondPageViewModel("client-1"));

    act(() => {
      result.current.addProduct(11, "Composta (en cubeta)");
    });

    expect(result.current.message).toBe(true);
    expect(result.current.name).toEqual(["Composta (en cubeta)"]);
  });

  test("debe eliminar un producto si su cantidad llega a cero", () => {
    const { result } = renderHook(() => useSecondPageViewModel("client-1"));

    act(() => {
      result.current.addProduct(5, "Humus");
    });

    act(() => {
      result.current.removeProduct(5, "Humus");
    });

    expect(result.current.selectedProducts).toEqual({});
  });

  test("debe disminuir la cantidad de un producto si tiene más de una unidad", () => {
    const { result } = renderHook(() => useSecondPageViewModel("client-1"));

    act(() => {
      result.current.addProduct(5, "Humus");
      result.current.addProduct(5, "Humus");
    });

    act(() => {
      result.current.removeProduct(5, "Humus");
    });

    expect(result.current.selectedProducts).toEqual({
      5: 1,
    });
  });

  test("debe quitar el nombre al remover un producto especial", () => {
    const { result } = renderHook(() => useSecondPageViewModel("client-1"));

    act(() => {
      result.current.addProduct(11, "Composta (en cubeta)");
    });

    act(() => {
      result.current.removeProduct(11, "Composta (en cubeta)");
    });

    expect(result.current.name).toEqual([]);
  });

  test("debe guardar correctamente la segunda sección", async () => {
    // Arrange
    mockGetLastRequestExecute.mockResolvedValue({ idRequest: "req-123" });
    mockGetExtraProductsExecute.mockResolvedValue([]);
    mockGetSelectedExtraProductsExecute.mockResolvedValue([]);
    mockSaveExtraProductsExecute.mockResolvedValue({
      message: "Productos guardados correctamente",
    });

    const { result } = renderHook(() => useSecondPageViewModel("client-1"));

    await waitFor(() => {
      expect(result.current.requestID).toBe("req-123");
    });

    act(() => {
      result.current.addProduct(1, "Composta");
      result.current.addProduct(1, "Composta");
      result.current.addProduct(2, "Tierra");
    });

    let response;

    // Act
    await act(async () => {
      response = await result.current.saveSecondSection();
    });

    // Assert
    expect(mockSaveExtraProductsExecute).toHaveBeenCalledWith("req-123", [
      { id_producto: 1, cantidad: 2 },
      { id_producto: 2, cantidad: 1 },
    ]);

    expect(response).toEqual({
      success: true,
      nextStep: 3,
    });

    expect(result.current.successMessage).toBe("Productos guardados correctamente");
    expect(result.current.error).toBe("");
    expect(result.current.loading).toBe(false);
  });

  test("debe regresar error si no hay solicitud activa al guardar", async () => {
    const { result } = renderHook(() => useSecondPageViewModel("client-1"));

    let response;

    await act(async () => {
      response = await result.current.saveSecondSection();
    });

    expect(response).toEqual({ success: false });
    expect(result.current.error).toBe("No hay solicitud activa.");
    expect(mockSaveExtraProductsExecute).not.toHaveBeenCalled();
  });

  test("debe manejar error al guardar productos", async () => {
    // Arrange
    mockGetLastRequestExecute.mockResolvedValue({ idRequest: "req-123" });
    mockGetExtraProductsExecute.mockResolvedValue([]);
    mockGetSelectedExtraProductsExecute.mockResolvedValue([]);
    mockSaveExtraProductsExecute.mockRejectedValue(new Error("Error al guardar"));

    const { result } = renderHook(() => useSecondPageViewModel("client-1"));

    await waitFor(() => {
      expect(result.current.requestID).toBe("req-123");
    });

    act(() => {
      result.current.addProduct(1, "Composta");
    });

    let response;

    // Act
    await act(async () => {
      response = await result.current.saveSecondSection();
    });

    // Assert
    expect(response).toEqual({ success: false });
    expect(result.current.error).toBe("Error al guardar");
    expect(result.current.loading).toBe(false);
  });
});