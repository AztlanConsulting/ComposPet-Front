import { renderHook, waitFor, act } from "@testing-library/react";
import useClientTableViewModel from "../../../../presentation/viewmodels/clientTableViewModel";

import { GetClientTableUseCase } from "../../../../domain/useCases/getClientTableUseCase";

jest.mock("../../../../data/datasources/clientApiClient", () => ({
    ClientApiClient: jest.fn(),
}));

jest.mock("../../../../data/repositories/clientTableRepository", () => ({
    ClientTableRepository: jest.fn(),
}));

jest.mock("../../../../domain/useCases/getClientTableUseCase", () => ({
    GetClientTableUseCase: jest.fn(),
}));

describe("useClientTableViewModel", () => {

    let executeMock;

    beforeEach(() => {
        jest.clearAllMocks();

        executeMock = jest.fn();

        GetClientTableUseCase.mockImplementation(() => ({
            execute: executeMock,
        }));
    });

    it("Carga correctamente la lista de clientes", async () => {
        // Arrange
        const mockData = [
            {
                name: "Juan Manuel M",
                lastRequest: "2026-05-01",
                balance: 1000,
                notes: "La casa azul al lado del OXXO",
                cellphone: "4426598564",
                address: "Prol. Bernardo Quintana 123, Querétaro",
                route: "Lunes 1",
                pets: 2,
                family: "2 adultos y 1 niño",
                status: true,
            }
        ];

        executeMock.mockResolvedValue(mockData);

        // Act
        let result;
        await act(async () => {
        ({result} = renderHook(() => useClientTableViewModel()))
        });

        // Assert
        await waitFor(() => {
            expect(result.current.clientList.length).toBe(1);
        });

        expect(executeMock).toHaveBeenCalled();
        expect(result.current.clientList).toEqual(mockData);
        expect(result.current.loading).toBe(false);
    });

    it("Maneja error al cargar clientes", async () => {
        // Arrange
        executeMock.mockRejectedValue(
            new Error("Error al cargar clientes")
        );

        const consoleSpy = jest
            .spyOn(console, "log")
            .mockImplementation(() => {});

        // Act
        let result;
        await act(async () => {
        ({result} = renderHook(() => useClientTableViewModel()))
        });

        // Assert
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(consoleSpy).toHaveBeenCalledWith(
            "Error loading client data: ",
            expect.any(Error)
        );

        consoleSpy.mockRestore();
    });

    it("No ejecuta múltiples llamadas si ya está cargando", async () => {
        // Arrange
        let resolvePromise;
        executeMock.mockImplementation(() =>
            new Promise((resolve) => {
                resolvePromise = resolve;
            })
        );

        // Act
        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.loading).toBe(true);
        });

        await act(async () => {
            resolvePromise([]);
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Assert
        expect(executeMock).toHaveBeenCalledTimes(1);
    });

    it("Inicializa correctamente defaultColDef", () => {
        // Act
        const { result } = renderHook(() =>
        useClientTableViewModel()
        );

        const colDef = result.current.defaultColDef;

        // Assert
        expect(colDef.filter).toBe(true);
        expect(colDef.sortable).toBe(true);
        expect(colDef.resizable).toBe(true);
        expect(colDef.floatingFilter).toBe(true);

        expect(colDef.tooltipValueGetter({ value: "test" }))
            .toBe("test");
    });
});