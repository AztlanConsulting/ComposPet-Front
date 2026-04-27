import { renderHook, waitFor, act } from "@testing-library/react";
import useFirstFormViewModel from "../../../../presentation/viewmodels/collectionRequest/firstFormViewModel";

import { GetCurrentCollectionRequestUseCase } from "../../../../domain/useCases/getCurrentCollectionRequestUseCase";
import { SaveCollectionRequestFirstSectionUseCase } from "../../../../domain/useCases/saveCollectionRequestFirstSectionUseCase";

jest.mock("../../../../data/datasources/collectionRequestApiClient", () => ({
    CollectionRequestApiClient: jest.fn(),
}));

jest.mock("../../../../data/repositories/collectionRequestRepository", () => ({
    CollectionRequestRepository: jest.fn(),
}));

jest.mock("../../../../domain/useCases/getCurrentCollectionRequestUseCase", () => ({
    GetCurrentCollectionRequestUseCase: jest.fn(),
}));

jest.mock("../../../../domain/useCases/saveCollectionRequestFirstSectionUseCase", () => ({
    SaveCollectionRequestFirstSectionUseCase: jest.fn(),
}));

describe("useFirstFormViewModel", () => {
    const clientId = "clientId";
    const weekStartDate = "2026-04-26T00:00:00.000Z";
    const weekEndDate = "2026-05-02T23:59:59.999Z";

    let getCurrentExecuteMock;
    let saveFirstSectionExecuteMock;

    beforeEach(() => {
        jest.clearAllMocks();

        getCurrentExecuteMock = jest.fn();
        saveFirstSectionExecuteMock = jest.fn();

        GetCurrentCollectionRequestUseCase.mockImplementation(() => ({
            execute: getCurrentExecuteMock,
        }));

        SaveCollectionRequestFirstSectionUseCase.mockImplementation(() => ({
            execute: saveFirstSectionExecuteMock,
        }));
    });

    it("Carga la solicitud actual correctamente", async () => {
        //Arrange (Preparar)
        getCurrentExecuteMock.mockResolvedValue({
            id: "requestId",
            wantsPickup: () => true,
            wantsAdditionalProducts: () => false,
            collectedBuckets: 3,
            deliveredBuckets: 1,
        });

        //Actuar
        const { result } = renderHook(() =>
            useFirstFormViewModel(
                clientId,
                weekStartDate,
                weekEndDate,
            ),
        );

        //Afirmar
        await waitFor(() => {
            expect(result.current.requestId).toBe("requestId");
        });

        expect(getCurrentExecuteMock).toHaveBeenCalledWith(
            clientId,
            weekStartDate,
            weekEndDate,
        );

        expect(result.current.wantsCollection).toBe(true);
        expect(result.current.wantsExtraProducts).toBe(false);
        expect(result.current.collectedBuckets).toBe(3);
        expect(result.current.deliveredBuckets).toBe(1);
        expect(result.current.loading).toBe(false);
    });

    it("Muestra el error si falla la carga de la solicitud", async () => {
        //Arrange (Preparar)
        getCurrentExecuteMock.mockRejectedValue(
            new Error("Error al cargar solicitud"),
        );

        //Actuar
        const { result } = renderHook(() =>
            useFirstFormViewModel(
                clientId,
                weekStartDate,
                weekEndDate,
            ),
        );

        //Afirmar 
        await waitFor(() => {
            expect(result.current.errors.general).toBe("Error al cargar solicitud");
        });

        expect(result.current.loading).toBe(false);
    });

    it("Validación error si falta requestId al guardar", async () => {
        //Arrange (Preparar)
        getCurrentExecuteMock.mockResolvedValue({
            id: "",
            wantsPickup: () => true,
            wantsAdditionalProducts: () => true,
            collectedBuckets: 1,
            deliveredBuckets: 1,
        });

        const { result } = renderHook(() =>
            useFirstFormViewModel(
                clientId,
                weekStartDate,
                weekEndDate,
            ),
        );

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        //Actuar
        let response;
        await act(async () => {
            response = await result.current.saveFirstSection();
        });

        //Afirmar
        expect(response).toEqual({ success: false });
        expect(result.current.errors.requestId).toBe(
            "Id de solicitud no encontrado. Por favor regresa a la pantalla anterior.",
        );
        expect(saveFirstSectionExecuteMock).not.toHaveBeenCalled();
    });

    it("dValidación si no se responde si quiere recolección", async () => {
        //Arrange (Preparar)
        getCurrentExecuteMock.mockResolvedValue({
            id: "requestId",
            wantsPickup: () => null,
            wantsAdditionalProducts: () => true,
            collectedBuckets: 0,
            deliveredBuckets: 0,
        });

        const { result } = renderHook(() =>
            useFirstFormViewModel(
                clientId,
                weekStartDate,
                weekEndDate,
            ),
        );

        await waitFor(() => {
            expect(result.current.requestId).toBe("requestId");
        });

        //Actuar
        let response;
        await act(async () => {
            response = await result.current.saveFirstSection();
        });

        //Afirmar
        expect(response).toEqual({ success: false });
        expect(result.current.errors.wantsCollection).toBe(
            "Indica si deseas recolección.",
        );
        expect(saveFirstSectionExecuteMock).not.toHaveBeenCalled();
    });

    it("Validación si ambas cubetas están en 0 cuando quiere recolección", async () => {
        //Arrange (Preparar)
        getCurrentExecuteMock.mockResolvedValue({
            id: "requestId",
            wantsPickup: () => true,
            wantsAdditionalProducts: () => true,
            collectedBuckets: 0,
            deliveredBuckets: 0,
        });

        const { result } = renderHook(() =>
            useFirstFormViewModel(
                clientId,
                weekStartDate,
                weekEndDate,
            ),
        );

        await waitFor(() => {
            expect(result.current.requestId).toBe("requestId");
        });

        //Actuar
        let response;
        await act(async () => {
            response = await result.current.saveFirstSection();
        });

        //Afirmar
        expect(response).toEqual({ success: false });
        expect(result.current.errors.collectedBuckets).toBe(
            "Las dos cantidades no pueden ser 0.",
        );
        expect(result.current.errors.deliveredBuckets).toBe(
            "Las dos cantidades no pueden ser 0.",
        );
        expect(saveFirstSectionExecuteMock).not.toHaveBeenCalled();
    });

    it("Guarda correctamente y avanza al paso 2 si quiere productos extra", async () => {
        //Arrange (Preparar)
        getCurrentExecuteMock.mockResolvedValue({
            id: "requestId",
            wantsPickup: () => true,
            wantsAdditionalProducts: () => true,
            collectedBuckets: 2,
            deliveredBuckets: 1,
        });

        saveFirstSectionExecuteMock.mockResolvedValue({
            wantsPickup: () => true,
            wantsAdditionalProducts: () => true,
        });

        const { result } = renderHook(() =>
            useFirstFormViewModel(
                clientId,
                weekStartDate,
                weekEndDate,
            ),
        );

        await waitFor(() => {
            expect(result.current.requestId).toBe("requestId");
        });

        //Actuar
        let response;
        await act(async () => {
            response = await result.current.saveFirstSection();
        });

        //Afirmar
        expect(saveFirstSectionExecuteMock).toHaveBeenCalledWith(
            "requestId",
            true,
            true,
            2,
            1,
        );

        expect(response).toEqual({
            success: true,
            nextStep: 2,
        });
    });

    it("Guarda correctamente y avanzar al paso 3 si no quiere productos extra pero sí recolección", async () => {
        //Arrange (Preparar)
        getCurrentExecuteMock.mockResolvedValue({
            id: "requestId",
            wantsPickup: () => true,
            wantsAdditionalProducts: () => false,
            collectedBuckets: 2,
            deliveredBuckets: 1,
        });

        saveFirstSectionExecuteMock.mockResolvedValue({
            wantsPickup: () => true,
            wantsAdditionalProducts: () => false,
        });

        const { result } = renderHook(() =>
            useFirstFormViewModel(
                clientId,
                weekStartDate,
                weekEndDate,
            ),
        );

        await waitFor(() => {
            expect(result.current.requestId).toBe("requestId");
        });

        //Actuar
        let response;
        await act(async () => {
            response = await result.current.saveFirstSection();
        });

        //Afirmar
        expect(response).toEqual({
            success: true,
            nextStep: 3,
        });
    });

    it("Guarda correctamente y avanzar al paso 4 si no quiere recolección ni productos extra", async () => {
        //Arrange (Preparar)
        getCurrentExecuteMock.mockResolvedValue({
            id: "requestId",
            wantsPickup: () => false,
            wantsAdditionalProducts: () => false,
            collectedBuckets: 0,
            deliveredBuckets: 0,
        });

        saveFirstSectionExecuteMock.mockResolvedValue({
            wantsPickup: () => false,
            wantsAdditionalProducts: () => false,
        });

        const { result } = renderHook(() =>
            useFirstFormViewModel(
                clientId,
                weekStartDate,
                weekEndDate,
            ),
        );

        await waitFor(() => {
            expect(result.current.requestId).toBe("requestId");
        });

        //Actuar
        let response;
        await act(async () => {
            response = await result.current.saveFirstSection();
        });

        //Afirmar
        expect(response).toEqual({
            success: true,
            nextStep: 4,
        });
    });

    it("Al guardar la primera sección existe algun error", async () => {
        //Arrange (Preparar)
        getCurrentExecuteMock.mockResolvedValue({
            id: "requestId",
            wantsPickup: () => true,
            wantsAdditionalProducts: () => true,
            collectedBuckets: 2,
            deliveredBuckets: 1,
        });

        saveFirstSectionExecuteMock.mockRejectedValue(
            new Error("Error al guardar la solicitud"),
        );

        const { result } = renderHook(() =>
            useFirstFormViewModel(
                clientId,
                weekStartDate,
                weekEndDate,
            ),
        );

        await waitFor(() => {
            expect(result.current.requestId).toBe("requestId");
        });

        //Actuar
        await act(async () => {
            await result.current.saveFirstSection();
        });

        //Afirmar
        expect(result.current.errors.requestId).toBe(
            "Error al guardar la solicitud",
        );
        expect(result.current.loading).toBe(false);
    });
});