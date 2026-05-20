import { renderHook, waitFor, act } from "@testing-library/react";

import useRoutesViewModel from "../../../../presentation/viewmodels/routesInfo/routesTable";

import {
    GetAvailableWeeksUseCase,
    GetDaysOfRoutesUseCase,
    GetFilteredRoutesUseCase,
    GetRoutesInfoUseCase,
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
    let mockGenerateMessagesExecute;

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

        GenerateRouteMessagesUseCase.mockImplementation(() => ({
            execute: mockGenerateMessagesExecute,
        }));

        window.open = jest.fn();
    });

    it("debe generar mensajes y abrir el Google Sheets cuando la respuesta es exitosa", async () => {
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
        await act(async () => {
            await result.current.handleGenerateMessages();
        });

        // Afirmar
        expect(mockGenerateMessagesExecute).toHaveBeenCalledWith(
            0,
            "Jueves"
        );

        expect(window.open).toHaveBeenCalledWith(
            "https://docs.google.com/spreadsheets/d/test-sheet-id",
            "_blank"
        );

        expect(result.current.loading).toBe(false);
    });

    it("debe lanzar error si no hay semana o día seleccionado", async () => {
        // Arrange
        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => {
            expect(result.current.selectedWeek).toBe(0);
        });

        act(() => {
            result.current.setSelectedDay(null);
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
            message: "No hay solicitudes para generar mensajes",
        });

        const { result } = renderHook(() => useRoutesViewModel());

        await waitFor(() => {
            expect(result.current.selectedWeek).toBe(0);
            expect(result.current.selectedDay).toBe("Jueves");
        });

        // Actuar y afirmar
        await expect(
            result.current.handleGenerateMessages()
        ).rejects.toThrow("No hay solicitudes para generar mensajes");

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