import { renderHook, waitFor } from "@testing-library/react";

import useCollectionRequestViewModel from "../../../../presentation/viewmodels/collectionRequest/collectionRequest";
import useAuthenticatedClient from "../../../../presentation/viewmodels/utils/useAuthenticatedClient";
import useCreditBalance from "../../../../presentation/viewmodels/utils/useCreditBalance";
import TimerAlert from "../../../../components/Template/timerAlert";

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
jest.mock("../../../../presentation/viewmodels/collectionRequest/firstFormViewModel", () => {
    return jest.fn(() => ({
        saveFirstSection: jest.fn(),
        loadCurrentCollectionRequest: jest.fn(),
    }));
});

// Mockea el ViewModel de la segunda página.
jest.mock("../../../../presentation/viewmodels/collectionRequest/secondPageViewModel", () => {
    return jest.fn(() => ({
        selectedProducts: {},
        saveSecondSection: jest.fn(),
        loadData: jest.fn(),
    }));
});

jest.mock("../../../../components/Template/confirmationAlert", () => jest.fn());

// Agrupa las pruebas relacionadas con el balance del cliente.
describe("useCollectionRequestViewModel - balance del cliente", () => {
    // Se ejecuta antes de cada prueba.
    beforeEach(() => {
        // Limpia llamadas y configuraciones previas de mocks.
        jest.clearAllMocks();

        // Simula que hay un cliente autenticado clientId".
        useAuthenticatedClient.mockReturnValue({
            clientId: "clientId",
        });
    });

    // Caso 1: Saldo permitido.
    it("debe permitir acceso si el balance es mayor a -500", async () => {
        // Arrange
        useCreditBalance.mockReturnValue({
            balance: -100,
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
            confirmText: "Continuar",
            timer: 10000,
        });
    });

    // Caso 4: balance todavía no cargado.
    it("no debe validar acceso si el balance todavía es null", async () => {
        // Arrange
        useCreditBalance.mockReturnValue({
            balance: null,
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