import { renderHook, act, waitFor } from "@testing-library/react";
import useCollectionRequestThirdSectionViewModel
from "../../../../presentation/viewmodels/collectionRequest/thirdFormViewModel";

import {
  GetCollectionSummaryUseCase,
} from "../../../../domain/useCases/getCollectionSummaryUseCase";

import {
  DeleteProductSummaryUseCase,
} from "../../../../domain/useCases/deleteProductSummaryUseCase";

import {
  UpdateCollectionTotalUseCase,
} from "../../../../domain/useCases/updateCollectionTotalUseCase";

jest.mock(
  "../../../../domain/useCases/getCollectionSummaryUseCase"
);

jest.mock(
  "../../../../domain/useCases/deleteProductSummaryUseCase"
);

jest.mock(
  "../../../../domain/useCases/updateCollectionTotalUseCase"
);

jest.mock(
  "../../../../data/datasources/collectionRequestApiClient",
  () => ({
    CollectionRequestApiClient: jest.fn(),
  })
);

jest.mock(
  "../../../../data/repositories/collectionSummaryRepository",
  () => ({
    CollectionSummaryRepositoryImpl: jest.fn(),
  })
);

describe("useCollectionRequestThirdSectionViewModel", () => {

  let mockGetExecute;
  let mockDeleteExecute;
  let mockUpdateExecute;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetExecute = jest.fn();
    mockDeleteExecute = jest.fn();
    mockUpdateExecute = jest.fn();

    GetCollectionSummaryUseCase.mockImplementation(() => ({
      execute: mockGetExecute,
    }));

    DeleteProductSummaryUseCase.mockImplementation(() => ({
      execute: mockDeleteExecute,
    }));

    UpdateCollectionTotalUseCase.mockImplementation(() => ({
      execute: mockUpdateExecute,
    }));
  });

  it("debe cargar correctamente el resumen inicial", async () => {

    mockGetExecute.mockResolvedValue({
      collection: {
        id_solicitud: 10,
        notes: "Sin observaciones",
      },
      products: [
        { id_producto: 1, cantidad: 2 },
      ],
      balance: 300,
      total: 500,
      payMethods: [
        { id_pago: 1, tipo: "Efectivo" },
        { id_pago: 2, tipo: "Saldo" },
      ],
      paymentMethods: [
        { id_pago: 1, tipo: "Efectivo" },
        { id_pago: 2, tipo: "Saldo" },
      ],
    });

    const { result } = renderHook(() =>
      useCollectionRequestThirdSectionViewModel(
        "client-1",
        "2026-04-20",
        "2026-04-26"
      )
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetExecute).toHaveBeenCalledWith(
      "client-1",
      "2026-04-20",
      "2026-04-26"
    );

    expect(result.current.collection.id_solicitud).toBe(10);
    expect(result.current.products.length).toBe(1);
    expect(result.current.balance).toBe(300);
    expect(result.current.collectionTotal).toBe(500);
    expect(result.current.notes).toBe("Sin observaciones");
    expect(result.current.paymentMethods.length).toBe(2);
  });

  it("debe eliminar producto y recargar resumen", async () => {

    mockGetExecute.mockResolvedValue({
      collection: { id_solicitud: 10, notes: "" },
      products: [],
      balance: 100,
      total: 200,
      payMethods: [],
      paymentMethods: [],
    });

    mockDeleteExecute.mockResolvedValue({});

    const { result } = renderHook(() =>
      useCollectionRequestThirdSectionViewModel(
        "client-1",
        "2026-04-20",
        "2026-04-26"
      )
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.removeProduct(5, 10, 2);
    });

    expect(mockDeleteExecute).toHaveBeenCalledWith(5, 10, 2);
    expect(mockGetExecute).toHaveBeenCalledTimes(2);
  });

  it("debe guardar tercera sección correctamente", async () => {

    mockGetExecute.mockResolvedValue({
      collection: {
        id_solicitud: 10,
        notes: "Acceso lateral",
      },
      products: [],
      balance: 100,
      total: 400,
      payMethods: [
        { id_pago: 1, tipo: "Efectivo" },
      ],
      paymentMethods: [
        { id_pago: 1, tipo: "Efectivo" },
      ],
    });

    mockUpdateExecute.mockResolvedValue({});

    const { result } = renderHook(() =>
      useCollectionRequestThirdSectionViewModel(
        "client-1",
        "2026-04-20",
        "2026-04-26"
      )
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let response;

    await act(async () => {
      response = await result.current.saveThirdSection();
    });

    expect(mockUpdateExecute).toHaveBeenCalledWith(
      10,
      400,
      1,
      "Acceso lateral"
    );

    expect(response).toEqual({
      success: true,
      nextStep: 4,
    });
  });

  it("debe cambiar selectedPaymentIndex", async () => {

    mockGetExecute.mockResolvedValue({
      collection: { id_solicitud: 10, notes: "" },
      products: [],
      balance: 0,
      total: 0,
      payMethods: [],
      paymentMethods: [],
    });

    const { result } = renderHook(() =>
      useCollectionRequestThirdSectionViewModel(
        "client-1",
        "2026-04-20",
        "2026-04-26"
      )
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setSelectedPaymentIndex(2);
    });

    expect(result.current.selectedPaymentIndex).toBe(2);
  });

});