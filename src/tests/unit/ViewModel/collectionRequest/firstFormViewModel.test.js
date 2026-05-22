import { renderHook, waitFor, act } from "@testing-library/react";
import useFirstFormViewModel from "../../../../presentation/viewmodels/collectionRequest/firstFormViewModel";

import { GetCurrentCollectionRequestUseCase } from "../../../../domain/useCases/getCurrentCollectionRequestUseCase";
import { SaveCollectionRequestFirstSectionUseCase } from "../../../../domain/useCases/saveCollectionRequestFirstSectionUseCase";

import TimerAlert from "../../../../components/Template/timerAlert";
import ProblemAlert from "../../../../components/Template/ProblemAlert";


const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock("../../../../components/Template/timerAlert", () => jest.fn());

jest.mock("../../../../components/Template/ProblemAlert", () => jest.fn());

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

        mockNavigate.mockClear();

        TimerAlert.mockResolvedValue({
            isConfirmed: true,
            dismiss: false,
        });

        ProblemAlert.mockResolvedValue({
            isConfirmed: true,
        });


        getCurrentExecuteMock = jest.fn();
        saveFirstSectionExecuteMock = jest.fn();

        GetCurrentCollectionRequestUseCase.mockImplementation(() => ({
            execute: getCurrentExecuteMock,
        }));

        SaveCollectionRequestFirstSectionUseCase.mockImplementation(() => ({
            execute: saveFirstSectionExecuteMock,
        }));
    });

    it("Redirecciona al inicio si la solicitud semanal ya está completada", async () => {
        //Arrange
        getCurrentExecuteMock.mockResolvedValue({
            id: "requestId",
            wantsPickup: () => true,
            wantsAdditionalProducts: () => false,
            collectedBuckets: 3,
            deliveredBuckets: 1,
            getStatus: () => true,
        });

        //Actuar
        renderHook(() =>
            useFirstFormViewModel(
                clientId,
                weekStartDate,
                weekEndDate,
            ),
        );

        //Afirmar
        await waitFor(() => {
            expect(TimerAlert).toHaveBeenCalledWith({
                title: "Solicitud ya completada",
                text: "Ya completaste tu solicitud de recolección de esta semana.",
                secondaryText: "Si deseas hacer una modificación urgente, contáctanos a través de WhatsApp.",
                confirmText: "Continuar",
                timer: 10000,
            });
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    it("Carga la solicitud actual correctamente", async () => {
        //Arrange (Preparar)
        getCurrentExecuteMock.mockResolvedValue({
            id: "requestId",
            wantsPickup: () => true,
            wantsAdditionalProducts: () => false,
            collectedBuckets: 3,
            deliveredBuckets: 1,
            getStatus: () => false,
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
            expect(result.current.loadError).toBe(
                "No pudimos cargar la información de tu solicitud. Intenta nuevamente más tarde."
            );
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
            getStatus: () => false,
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

        expect(ProblemAlert).not.toHaveBeenCalled();
        expect(result.current.loading).toBe(false);
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
            getStatus: () => false,
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
            getStatus: () => false,
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
            getStatus: () => false,
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
            getStatus: () => false,
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
            getStatus: () => false,
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
            nextStep: 3,
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
            getStatus: () => false,
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
        expect(ProblemAlert).toHaveBeenCalledWith({
            title: "No pudimos guardar la información",
            text: "Ocurrió un problema al guardar tu solicitud. Intenta nuevamente.",
            icon: "error",
            confirmText: "Entendido",
        });

        expect(result.current.errors.requestId).toBe("");
        expect(result.current.loading).toBe(false);
    });
});