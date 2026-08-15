import { renderHook, act, waitFor } from "@testing-library/react";
import useCollectionRequestViewModel from "../../../../presentation/viewmodels/collectionRequest/collectionRequest";

import useAuthenticatedClient from "../../../../presentation/viewmodels/utils/useAuthenticatedClient";
import useCreditBalance from "../../../../presentation/viewmodels/utils/useCreditBalance";
import useCollectionRequestFirstSectionViewModel from "../../../../presentation/viewmodels/collectionRequest/firstFormViewModel";
import useSecondPageViewModel from "../../../../presentation/viewmodels/collectionRequest/secondPageViewModel";
import useCollectionRequestThirdSectionViewModel from "../../../../presentation/viewmodels/collectionRequest/thirdFormViewModel";

jest.mock("axios", () => ({
    create: jest.fn(() => ({
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() },
        },
    })),
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

//Mockea los hooks y los viewModels para collectionRequestViewModel
jest.mock("../../../../presentation/viewmodels/utils/useAuthenticatedClient");
jest.mock("../../../../presentation/viewmodels/utils/useCreditBalance");
jest.mock("../../../../presentation/viewmodels/collectionRequest/firstFormViewModel");
jest.mock("../../../../presentation/viewmodels/collectionRequest/secondPageViewModel");
jest.mock("../../../../presentation/viewmodels/collectionRequest/thirdFormViewModel");


jest.mock("../../../../components/Template/confirmationAlert", () => jest.fn());
jest.mock("../../../../components/Template/timerAlert", () => jest.fn());

// Fija el reloj del sistema en un miércoles al mediodía, dentro de la
// ventana válida de theClientIsInTime para cualquier routeDay usado en
// estos tests (evita que el test dependa del día/hora real de ejecución).
beforeAll(() => {
    jest.useFakeTimers({
        doNotFake: [
            'setTimeout',
            'clearTimeout',
            'setInterval',
            'clearInterval',
            'setImmediate',
            'clearImmediate',
            'queueMicrotask',
            'nextTick',
        ],
    });
});

afterAll(() => {
    jest.useRealTimers();
});

describe("useCollectionRequestViewModel - progreso del formulario", () => {
    let saveFirstSectionMock;
    let loadCurrentCollectionRequestMock;
    let saveSecondSectionMock;
    let loadDataMock;
    let saveThirdSectionMock;
    let loadSummaryMock;

    beforeEach(() => {
        jest.clearAllMocks();

        jest.setSystemTime(new Date('2026-08-19T12:00:00'));

        //Simula las funciones utilizadas para cambiar de steps
        saveFirstSectionMock = jest.fn();
        loadCurrentCollectionRequestMock = jest.fn();
        saveSecondSectionMock = jest.fn();
        loadDataMock = jest.fn();
        saveThirdSectionMock = jest.fn();
        loadSummaryMock = jest.fn();

        useAuthenticatedClient.mockReturnValue({
            clientId: "clientId",
            routeDay: "Sábado",
            loading: false,
            error: null,
        });

        useCreditBalance.mockReturnValue({
            balance: 0,
            loading: false,
            error: null,
        });

        useCollectionRequestFirstSectionViewModel.mockReturnValue({
            saveFirstSection: saveFirstSectionMock,
            loadCurrentCollectionRequest: loadCurrentCollectionRequestMock,
            status: false,
            loading: false,
            loadError: null,
        });

        useSecondPageViewModel.mockReturnValue({
            selectedProducts: {
                1: 2,
            },
            saveSecondSection: saveSecondSectionMock,
            loadData: loadDataMock,
            loading: false,
        });

        useCollectionRequestThirdSectionViewModel.mockReturnValue({
            loadSummary: loadSummaryMock,
            saveThirdSection: saveThirdSectionMock,
        });
    });

    it("Iniciar en el paso 1 y tener 3 pasos totales", () => {

        //Actuar (Preparar)
        const { result } = renderHook(() => useCollectionRequestViewModel());

        //Afirmar
        expect(result.current.currentStep).toBe(1);
        expect(result.current.progressSteps.length).toBe(3);
        expect(result.current.primaryButtonText).toBe("Siguiente");
        expect(result.current.secondaryButtonText).toBe("Cancelar");
    });

    it("Avanza del paso 1 al nextStep indicado en firstSectionViewModel", async () => {
        //Arrange (Preparar)
        saveFirstSectionMock.mockResolvedValue({
            success: true,
            nextStep: 2,
        });

        
        const { result } = renderHook(() => useCollectionRequestViewModel());

        //Actuar

        await waitFor(() => {
            expect(result.current.debtAccess).toBe(true);
        });

        await act(async () => {
            await result.current.onPrimaryAction();
        });

        //Afirmar
        expect(saveFirstSectionMock).toHaveBeenCalled();
        expect(result.current.currentStep).toBe(2);
        expect(result.current.secondaryButtonText).toBe("Regresar");
    });

    it("Si irstSectionViewModel retorna success false no avanzar", async () => {
        //Arrange (Preparar)
        saveFirstSectionMock.mockResolvedValue({
            success: false,
        });

        const { result } = renderHook(() => useCollectionRequestViewModel());

        //Actuar
        await waitFor(() => {
            expect(result.current.debtAccess).toBe(true);
        });

        await act(async () => {
            await result.current.onPrimaryAction();
        });

        //Afirmar
        expect(saveFirstSectionMock).toHaveBeenCalled();
        expect(result.current.currentStep).toBe(1);
    });

    it("Regresar del paso 2 al paso 1 con onSecondaryAction", async () => {
        //Arrange (Preparar)
        saveFirstSectionMock.mockResolvedValue({
            success: true,
            nextStep: 2,
        });

        const { result } = renderHook(() => useCollectionRequestViewModel());

        //Actuar

        await waitFor(() => {
            expect(result.current.debtAccess).toBe(true);
        });

        await act(async () => {
            await result.current.onPrimaryAction();
        });

        //Afirmar
        expect(result.current.currentStep).toBe(2);

        //Actuar
        await act(async () => {
            await result.current.onSecondaryAction();
        });

        //Afirmar
        expect(loadCurrentCollectionRequestMock).toHaveBeenCalled();
        expect(result.current.currentStep).toBe(1);
    });

    it("Avanzar del paso 2 al nextStep indicado por secondSectionViewModel", async () => {
        //Arrange (Preparar)
        saveFirstSectionMock.mockResolvedValue({
            success: true,
            nextStep: 2,
        });

        saveSecondSectionMock.mockResolvedValue({
            success: true,
            nextStep: 3,
        });

        const { result } = renderHook(() => useCollectionRequestViewModel());

        //Actuar

        await waitFor(() => {
            expect(result.current.debtAccess).toBe(true);
        });

        await act(async () => {
            await result.current.onPrimaryAction();
        });

        //Afirmar
        expect(result.current.currentStep).toBe(2);

        //Actuar

        await waitFor(() => {
            expect(result.current.debtAccess).toBe(true);
        });

        await act(async () => {
            await result.current.onPrimaryAction();
        });

        //Afirmar
        expect(saveSecondSectionMock).toHaveBeenCalled();
        expect(loadSummaryMock).toHaveBeenCalledTimes(1);
        expect(result.current.currentStep).toBe(3);
    });
});