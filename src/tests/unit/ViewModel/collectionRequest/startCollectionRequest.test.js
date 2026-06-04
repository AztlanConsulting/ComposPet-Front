import { renderHook, waitFor } from "@testing-library/react";

import useCollectionRequestViewModel from "../../../../presentation/viewmodels/collectionRequest/collectionRequest";
import useAuthenticatedClient from "../../../../presentation/viewmodels/utils/useAuthenticatedClient";
import useCreditBalance from "../../../../presentation/viewmodels/utils/useCreditBalance";
import TimerAlert from "../../../../components/Template/timerAlert";

import useCollectionRequestFirstSectionViewModel from "../../../../presentation/viewmodels/collectionRequest/firstFormViewModel";
import useSecondPageViewModel from "../../../../presentation/viewmodels/collectionRequest/secondPageViewModel";
import useCollectionRequestThirdSectionViewModel from "../../../../presentation/viewmodels/collectionRequest/thirdFormViewModel";


jest.mock("axios", () => ({
    create: jest.fn(() => ({
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() }
        }
    }))
}));

// Crea una función mock para simular navigate() de React Router.
const mockNavigate = jest.fn();

// Mockea react-router-dom.
jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

// Mockea el hook useAuthenticatedClient.
jest.mock("../../../../presentation/viewmodels/utils/useAuthenticatedClient");

// Mockea el hook useCreditBalance.
jest.mock("../../../../presentation/viewmodels/utils/useCreditBalance");

// Mockea TimerAlert.
jest.mock("../../../../components/Template/timerAlert", () => jest.fn());

// Mockea el ViewModel de la primera sección.
jest.mock("../../../../presentation/viewmodels/collectionRequest/firstFormViewModel");
jest.mock("../../../../presentation/viewmodels/collectionRequest/secondPageViewModel");
jest.mock("../../../../presentation/viewmodels/collectionRequest/thirdFormViewModel");

jest.mock("../../../../components/Template/confirmationAlert", () => jest.fn());

const createFirstSectionViewModelMock = (overrides = {}) => ({
    requestId: "requestId",
    wantsCollection: true,
    wantsExtraProducts: false,
    collectedBuckets: 1,
    deliveredBuckets: 1,
    status: false,
    loading: false,
    loadError: null,
    errors: {},
    setWantsCollection: jest.fn(),
    setWantsExtraProducts: jest.fn(),
    handleDeliveredBucketsChange: jest.fn(),
    handleCollectedBucketsChange: jest.fn(),
    incrementDeliveredBuckets: jest.fn(),
    decrementDeliveredBuckets: jest.fn(),
    incrementCollectedBuckets: jest.fn(),
    decrementCollectedBuckets: jest.fn(),
    saveFirstSection: jest.fn(),
    loadCurrentCollectionRequest: jest.fn(),
    ...overrides,
});

beforeAll(() => {
    jest.useFakeTimers();

    // Miércoles 13 de mayo 2026 a las 10 AM
    jest.setSystemTime(new Date("2026-05-13T10:00:00"));
});

afterAll(() => {
    jest.useRealTimers();
});

// Agrupa las pruebas relacionadas con el balance del cliente.
describe("useCollectionRequestViewModel - balance del cliente", () => {
    // Se ejecuta antes de cada prueba.
    beforeEach(() => {
        jest.clearAllMocks();

        useAuthenticatedClient.mockReturnValue({
            clientId: "clientId",
            routeDay: "Viernes",
            loading: false,
            error: null,
        });

        useCreditBalance.mockReturnValue({
            balance: 0,
            loading: false,
            error: null,
        });

        useCollectionRequestFirstSectionViewModel.mockReturnValue(
            createFirstSectionViewModelMock()
        );

        useSecondPageViewModel.mockReturnValue({
            selectedProducts: {},
            saveSecondSection: jest.fn(),
            loadData: jest.fn(),
            loading: false,
        });

        useCollectionRequestThirdSectionViewModel.mockReturnValue({
            loadSummary: jest.fn(),
            saveThirdSection: jest.fn(),
        });
    });

    // Caso 0: Cliente fuera de rango de tiempo permitido.
    it("debe mostrar alerta y navegar al inicio si el cliente está fuera del rango permitido por día de ruta", async () => {
        //Arrange
        useAuthenticatedClient.mockReturnValue({
            clientId: "clientId",
            routeDay: "Domingo",
            loading: false,
            error: null,
        });

        useCreditBalance.mockReturnValue({
            balance: 0,
            loading: false,
            error: null,
        });

        TimerAlert.mockResolvedValue({
            isConfirmed: true,
        });

        renderHook(() => useCollectionRequestViewModel());

        //Actuar
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });

        //Afirmar
        expect(TimerAlert).toHaveBeenCalledWith({
            title: "Solicitud no disponible",
            text: "Ya no te encuentras dentro del horario permitido para generar una solicitud, antes de tu día de recolecta." ,
            secondaryText: "Si es una urgencia, contáctanos a través de WhatsApp.",
            confirmText: "Continuar",
            timer: 10000,
        });
    });

    // 0.1: Caso para si no llega un dia de ruta
    it("no debe validar acceso si el día de ruta todavía no está cargado", async () => {
        //Arrange
        useAuthenticatedClient.mockReturnValue({
            clientId: "clientId",
            routeDay: null,
            loading: false,
            error: null,
        });

        useCreditBalance.mockReturnValue({
            balance: 0,
            loading: false,
            error: null,
        });

        //Actuar
        const { result } = renderHook(() => useCollectionRequestViewModel());

        //Afirmar
        expect(result.current.debtAccess).toBe(false);
        expect(TimerAlert).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    // Caso 1: Saldo permitido.
    it("debe permitir acceso si el balance es mayor a -500", async () => {
        // Arrange
        useCreditBalance.mockReturnValue({
            balance: -100,
            loading: false,
            error: null,
        });


        // Actuar
        // Ejecuta el ViewModel como si estuviera dentro de un componente React.
        const { result } = renderHook(() => useCollectionRequestViewModel());

        // Afirmar
        // Espera a que el useEffect actualice debtAccess a true.
        await waitFor(() => {
            expect(result.current.debtAccess).toBe(true);
        });

        // Verifica que no se haya mostrado alerta.
        expect(TimerAlert).not.toHaveBeenCalled();

        // Verifica que no haya navegación al inicio.
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    // Caso 2: saldo con advertencia.
    it("debe mostrar alerta y permitir acceso si el balance está entre -500 y -1500", async () => {
        // Arrange
        useCreditBalance.mockReturnValue({
            balance: -600,
            loading: false,
            error: null,
        });

        // Simula que el usuario confirmó o cerró la alerta.
        TimerAlert.mockResolvedValue({
            isConfirmed: true,
        });

        // Actuar
        // Ejecuta el ViewModel.
        const { result } = renderHook(() => useCollectionRequestViewModel());

        // Afirmar
        // Espera a que debtAccess cambie a true.
        await waitFor(() => {
            expect(result.current.debtAccess).toBe(true);
        });

        // Verifica que TimerAlert haya sido llamada con el contenido correcto.
        expect(TimerAlert).toHaveBeenCalledWith({
            title: "Adeudo Pendiente",
            text: "Tienes un adeudo mayor a $500, te recordamos pagarlo lo antes posible.",
            secondaryText: "",
            confirmText: "Continuar",
            timer: 10000,
        });

        // Verifica que no haya redirección.
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    // Caso 3: Solicitud bloqueada.
    it("debe mostrar alerta y navegar al inicio si el balance es menor o igual a -1500", async () => {
        // Arrange
        useCreditBalance.mockReturnValue({
            balance: -1500,
            loading: false,
            error: null,
        });

        // Simula que le dieron click a confirmar
        TimerAlert.mockResolvedValue({
            isConfirmed: true,
        });

        // Actuar
        const { result } = renderHook(() => useCollectionRequestViewModel());

        // Afirmar
        // Espera a que se llame navigate("/") después de la alerta.
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });

        // Verifica que no se haya permitido acceso.
        expect(result.current.debtAccess).toBe(false);

        // Verifica que la alerta mostrada sea la de solicitud no disponible.
        expect(TimerAlert).toHaveBeenCalledWith({
            title: "Solicitud no disponible",
            text: "Tienes un adeudo mayor a $1500, por lo que no es posible generar una solicitud.",
            secondaryText: "",
            confirmText: "Continuar",
            timer: 10000,
        });
    });

    // Caso 4: balance todavía no cargado.
    it("no debe validar acceso si el balance todavía es null", async () => {
        // Arrange
        useCreditBalance.mockReturnValue({
            balance: null,
            loading: false,
            error: null,
        });

        // Actuar
        const { result } = renderHook(() => useCollectionRequestViewModel());

        // Assert
        expect(result.current.debtAccess).toBe(false);

        // No debe mostrar alerta.
        expect(TimerAlert).not.toHaveBeenCalled();

        // No debe redireccionar.
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});