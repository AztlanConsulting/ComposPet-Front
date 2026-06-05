jest.mock("../../../../components/Template/ProblemAlert", () => jest.fn());
jest.mock("../../../../components/Template/AceptAlert", () => jest.fn());

jest.mock("../../../../presentation/viewmodels/utils/routesTableColumnDefinitions", () => ({
    getRoutesTableColumns: jest.fn(() => []),
}));

import { renderHook, waitFor, act } from "@testing-library/react";

import useRoutesViewModel from "../../../../presentation/viewmodels/routesInfo/routesTable";

import {
    GetAvailableWeeksUseCase,
    GetDaysOfRoutesUseCase,
    GetFilteredRoutesUseCase,
    GetRoutesInfoUseCase,
    GetDataForEditingRequestUseCase,
    UpdateRequestUseCase,
} from "../../../../domain/useCases/routesInfo/routesTableUseCase";

import { GenerateRouteMessagesUseCase } from "../../../../domain/useCases/routesInfo/generateRouteMessagesUseCase";

jest.mock("../../../../domain/useCases/routesInfo/routesTableUseCase");
jest.mock("../../../../domain/useCases/routesInfo/generateRouteMessagesUseCase");

jest.mock("../../../../data/repositories/routesInfo/routesRepository", () => ({
    RoutesRepository: jest.fn(),
}));

jest.mock("../../../../presentation/viewmodels/utils/searchValidation", () => ({
    isValidSearchText: jest.fn(() => true),
}));

describe("useRoutesViewModel - generar mensajes de confirmación", () => {
    let mockGetAvailableWeeksExecute;
    let mockGetDaysOfRoutesExecute;
    let mockGetFilteredRoutesExecute;
    let mockGetDropdownInfoExecute;
    let mockGenerateMessagesExecute;

    beforeAll(() => {
        jest.useFakeTimers();

        // Jueves 14 de mayo de 2026.
        // Esto hace que getDefaultDay encuentre "Jueves".
        jest.setSystemTime(new Date("2026-05-14T10:00:00"));
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    beforeEach(() => {
        jest.clearAllMocks();

        mockGetAvailableWeeksExecute = jest.fn().mockResolvedValue([
            {
                weekStart: "2026-05-10T00:00:00.000Z",
                weekEnd: "2026-05-17T00:00:00.000Z",
            },
        ]);

        mockGetDaysOfRoutesExecute = jest.fn().mockResolvedValue([
            {
                dia_ruta: "Jueves",
            },
        ]);

        mockGetFilteredRoutesExecute = jest.fn().mockResolvedValue([]);

        mockGetDropdownInfoExecute = jest.fn().mockResolvedValue({
            payMethods: [],
            extraProducts: [],
        });


        mockGenerateMessagesExecute = jest.fn();

        GetRoutesInfoUseCase.mockImplementation(() => ({
            execute: jest.fn(),
        }));

        GetAvailableWeeksUseCase.mockImplementation(() => ({
            execute: mockGetAvailableWeeksExecute,
        }));

        GetDaysOfRoutesUseCase.mockImplementation(() => ({
            execute: mockGetDaysOfRoutesExecute,
        }));

        GetFilteredRoutesUseCase.mockImplementation(() => ({
            execute: mockGetFilteredRoutesExecute,
        }));

        GetDataForEditingRequestUseCase.mockImplementation(() => ({
            execute: mockGetDropdownInfoExecute,
        }));

        UpdateRequestUseCase.mockImplementation(() => ({
            execute: jest.fn(),
        }));


        GenerateRouteMessagesUseCase.mockImplementation(() => ({
            execute: mockGenerateMessagesExecute,
        }));

        window.open = jest.fn();
    });

    it("debe generar mensajes y regresar la URL del Google Sheets cuando la respuesta es exitosa", async () => {
        // Arrange
        mockGenerateMessagesExecute.mockResolvedValue({
            success: true,
            data: {
                sheetUrl: "https://docs.google.com/spreadsheets/d/test-sheet-id",
            },
        });

        const { result } = renderHook(() => useRoutesViewModel());
        await waitFor(() => {
            expect(result.current.selectedWeek).toBe(0);
            expect(result.current.selectedDay).toBe("Jueves");
        });

        // Actuar
        let actionResult;

        await act(async () => {
            actionResult = await result.current.handleGenerateMessages();
        });

        // Afirmar
        expect(mockGenerateMessagesExecute).toHaveBeenCalledWith(
            0,
            "Jueves"
        );

        expect(actionResult).toBe(
            "https://docs.google.com/spreadsheets/d/test-sheet-id"
        );

        expect(window.open).not.toHaveBeenCalled();

        expect(result.current.loading).toBe(false);
    });

    it("debe lanzar error si no hay semana o día seleccionado", async () => {
        // Arrange
        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => {
            expect(result.current.selectedWeek).toBe(0);
            expect(result.current.selectedDay).toBe("Jueves");
        });

        await act(async () => {
            await result.current.setSelectedDay(null);
        });

        // Actuar y afirmar
        await expect(
            result.current.handleGenerateMessages()
        ).rejects.toThrow("Selecciona una semana y un día de ruta");

        expect(mockGenerateMessagesExecute).not.toHaveBeenCalled();
        expect(window.open).not.toHaveBeenCalled();
    });

    it("debe lanzar error si el backend responde success false", async () => {
        // Arrange
        mockGenerateMessagesExecute.mockResolvedValue({
            success: false,
            message: "Revisa que las solicitudes estén completas y agrega un horario a cada una",
        });

        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => {
            expect(result.current.selectedWeek).toBe(0);
            expect(result.current.selectedDay).toBe("Jueves");
        });

        // Actuar y afirmar
        await expect(
            result.current.handleGenerateMessages()
        ).rejects.toThrow("Revisa que las solicitudes estén completas y agrega un horario a cada una");

        expect(mockGenerateMessagesExecute).toHaveBeenCalledWith(
            0,
            "Jueves"
        );

        expect(window.open).not.toHaveBeenCalled();
        expect(result.current.loading).toBe(false);
    });

    it("debe lanzar error si falla el caso de uso", async () => {
        // Arrange
        mockGenerateMessagesExecute.mockRejectedValue(
            new Error("Error al generar mensajes")
        );

        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => {
            expect(result.current.selectedWeek).toBe(0);
            expect(result.current.selectedDay).toBe("Jueves");
        });

        // Actuar y afirmar
        await expect(
            result.current.handleGenerateMessages()
        ).rejects.toThrow("Error al generar mensajes");

        expect(mockGenerateMessagesExecute).toHaveBeenCalledWith(
            0,
            "Jueves"
        );

        expect(window.open).not.toHaveBeenCalled();
        expect(result.current.loading).toBe(false);
    });
});