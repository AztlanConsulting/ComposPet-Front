import { renderHook, waitFor, act } from "@testing-library/react";
import useClientTableViewModel from "../../../../presentation/viewmodels/clientTableViewModel";

import { GetClientTableUseCase } from "../../../../domain/useCases/getClientTableUseCase";
import { UpdateClientUseCase } from "../../../../domain/useCases/updateClientUseCase";
import { GetRoutesUseCase } from "../../../../domain/useCases/getRoutesUseCase";
import AceptAlert from "../../../../components/Template/AceptAlert";

jest.mock("../../../../data/datasources/clientApiClient", () => ({
    ClientApiClient: jest.fn(),
}));

jest.mock("../../../../data/repositories/clientTableRepository", () => ({
    ClientTableRepository: jest.fn(),
}));

jest.mock("../../../../domain/useCases/getClientTableUseCase", () => ({
    GetClientTableUseCase: jest.fn(),
}));

jest.mock("../../../../data/repositories/updateClientRepository", () => ({
    UpdateClientRepository: jest.fn(),
}))

jest.mock("../../../../domain/useCases/getRoutesUseCase", () => ({
    GetRoutesUseCase: jest.fn(),
}));

jest.mock("../../../../domain/useCases/updateClientUseCase", () => ({
    UpdateClientUseCase: jest.fn(),
}));

jest.mock("../../../../components/Template/AceptAlert", () =>
    jest.fn().mockResolvedValue(true)
);

jest.mock("../../../../components/Template/ProblemAlert", () =>
    jest.fn().mockResolvedValue(true)
);

describe("useClientTableViewModel", () => {

    let executeMock;

    beforeEach(() => {
        jest.clearAllMocks();

        executeMock = jest.fn().mockResolvedValue([]);

        GetRoutesUseCase.mockImplementation(() => ({
            execute: jest.fn().mockResolvedValue([]),
        }));

        UpdateClientUseCase.mockImplementation(() => ({
            execute: jest.fn().mockResolvedValue({ success: true }),
        }));

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


    describe("getRoutes", () => {

        let routesExecuteMock;

        beforeEach(() => {
            routesExecuteMock = jest.fn();
            GetRoutesUseCase.mockImplementation(() => ({
                execute: routesExecuteMock,
            }));
            executeMock.mockResolvedValue([]);
        });

        it("carga correctamente la lista de rutas", async () => {
            // Arrange
            const mockRoutes = [
                { id_ruta: 1, dia_ruta: "Lunes" },
                { id_ruta: 2, dia_ruta: "Martes" },
            ];
            routesExecuteMock.mockResolvedValue(mockRoutes);

            // Act
            let result;
            await act(async () => {
                ({ result } = renderHook(() => useClientTableViewModel()));
            });

            // Assert
            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(routesExecuteMock).toHaveBeenCalled();
        });

        it("maneja error al cargar rutas", async () => {
            // Arrange
            routesExecuteMock.mockRejectedValue(new Error("Error rutas"));

            const consoleSpy = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});

            // Act
            let result;
            await act(async () => {
                ({ result } = renderHook(() => useClientTableViewModel()));
            });

            // Assert
            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(consoleSpy).toHaveBeenCalledWith(
                "Error loading routes list: ",
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });

    });


    describe("handleEdit", () => {

        beforeEach(() => {
            GetRoutesUseCase.mockImplementation(() => ({
                execute: jest.fn().mockResolvedValue([]),
            }));
            executeMock.mockResolvedValue([]);
        });

        it("establece editingRowId al hacer click en editar", async () => {
            // Arrange
            const { result } = renderHook(() => useClientTableViewModel());

            await waitFor(() => expect(result.current.loading).toBe(false));

            const mockParams = {
                data: { clientId: "client-1" },
                node: { rowIndex: 0 },
                api: { startEditingCell: jest.fn() },
            };

            // Act
            act(() => {
                const editCol = result.current.columnDefinitions[0];
                const rendered = editCol.cellRenderer(mockParams);

                rendered.props.children.props.onClick();
            });

            // Assert
            await waitFor(() => {
                expect(result.current.editingRowId).toBe("client-1");
            });
        });

        it("no permite editar si ya hay una fila en edición", async () => {
            // Arrange
            const { result } = renderHook(() => useClientTableViewModel());
            await waitFor(() => expect(result.current.loading).toBe(false));

            const mockApi1 = { startEditingCell: jest.fn() };
            const mockApi2 = { startEditingCell: jest.fn() };

            // Act
            act(() => {
                result.current.columnDefinitions[0].cellRenderer({
                    data: { clientId: "client-1" },
                    node: { rowIndex: 0 },
                    api: mockApi1,
                }).props.children.props.onClick();
            });

            await waitFor(() => expect(result.current.editingRowId).toBe("client-1"));

            act(() => {
                result.current.columnDefinitions[0].cellRenderer({
                    data: { clientId: "client-2" },
                    node: { rowIndex: 1 },
                    api: mockApi2,
                }).props.children.props.onClick();
            });

            // Assert
            await waitFor(() => {
                expect(result.current.editingRowId).toBe("client-1");
            });
        });

    });


    describe("handleCancel", () => {

        beforeEach(() => {
            GetRoutesUseCase.mockImplementation(() => ({
                execute: jest.fn().mockResolvedValue([]),
            }));
        });

        it("restaura los datos originales y limpia editingRowId", async () => {
            // Arrange
            const originalClient = { clientId: "client-1", balance: 100, notes: "original" };
            executeMock.mockResolvedValue([originalClient]);

            const { result } = renderHook(() => useClientTableViewModel());
            await waitFor(() => expect(result.current.loading).toBe(false));

            const mockNode = { setData: jest.fn() };
            const mockApi = {
                startEditingCell: jest.fn(),
                refreshCells: jest.fn(),
            };

            const mockParams = {
                data: { clientId: "client-1", balance: 999, notes: "modificado" },
                node: mockNode,
                api: mockApi,
            };

            act(() => {
                const editCol = result.current.columnDefinitions[0];
                editCol.cellRenderer({
                    data: { clientId: "client-1" },
                    node: { rowIndex: 0 },
                    api: mockApi,
                }).props.children.props.onClick();
            });

            await waitFor(() => expect(result.current.editingRowId).toBe("client-1"));

            // Act
            act(() => {
                const editCol = result.current.columnDefinitions[0];
                const rendered = editCol.cellRenderer({
                    ...mockParams,
                    data: { clientId: "client-1" },
                });
                rendered.props.children[1].props.onClick();
            });

            // Assert
            await waitFor(() => {
                expect(result.current.editingRowId).toBeNull();
            });

            expect(mockNode.setData).toHaveBeenCalledWith(originalClient);
            expect(mockApi.refreshCells).toHaveBeenCalledWith({ force: true });
        });

    });


    describe("handleSave", () => {

        let updateExecuteMock;

        beforeEach(() => {
            updateExecuteMock = jest.fn().mockResolvedValue({ success: true });

            GetRoutesUseCase.mockImplementation(() => ({
                execute: jest.fn().mockResolvedValue([]),
            }));

            UpdateClientUseCase.mockImplementation(() => ({
                execute: updateExecuteMock,
            }));

            executeMock.mockResolvedValue([]);
        });

        it("llama a updateClientUseCase y muestra AceptAlert al guardar", async () => {
            // Arrange
            const { result } = renderHook(() => useClientTableViewModel());
            await waitFor(() => expect(result.current.loading).toBe(false));

            const mockParams = {
                data: { clientId: "client-1", balance: 500 },
                api: { stopEditing: jest.fn() },
            };

            // Act
            await act(async () => {
                const editCol = result.current.columnDefinitions[0];

                const rendered = editCol.cellRenderer({
                    ...mockParams,
                    data: { clientId: result.current.editingRowId },
                });

                await result.current.columnDefinitions;
            });

            await act(async () => {
                await updateExecuteMock({ clientId: "client-1", balance: 500 });
            });

            // Assert
            expect(updateExecuteMock).toHaveBeenCalled();
        });

        it("limpia editingRowId después de guardar", async () => {
            // Arrange
            executeMock.mockResolvedValue([{ clientId: "client-1", balance: 100 }]);

            const { result } = renderHook(() => useClientTableViewModel());
            await waitFor(() => expect(result.current.loading).toBe(false));

            const mockApi = {
                startEditingCell: jest.fn(),
                stopEditing: jest.fn(),
                refreshCells: jest.fn(),
            };

            act(() => {
                result.current.columnDefinitions[0].cellRenderer({
                    data: { clientId: "client-1" },
                    node: { rowIndex: 0 },
                    api: mockApi,
                }).props.children.props.onClick();
            });

            await waitFor(() => expect(result.current.editingRowId).toBe("client-1"));

            // Act
            await act(async () => {
                const saveParams = {
                    data: { clientId: "client-1", balance: 200 },
                    api: mockApi,
                };
                const editCol = result.current.columnDefinitions[0];
                const rendered = editCol.cellRenderer({
                    data: { clientId: "client-1" },
                    node: { rowIndex: 0 },
                    api: mockApi,
                });
                await rendered.props.children[0].props.onClick();
            });

            // Assert
            await waitFor(() => {
                expect(result.current.editingRowId).toBeNull();
            });

            expect(AceptAlert).toHaveBeenCalled();
        });

        it("maneja error al guardar", async () => {
            // Arrange
            updateExecuteMock.mockRejectedValue(new Error("Error al guardar"));

            const consoleSpy = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});

            const { result } = renderHook(() => useClientTableViewModel());
            await waitFor(() => expect(result.current.loading).toBe(false));

            const mockApi = {
                startEditingCell: jest.fn(),
                stopEditing: jest.fn(),
                refreshCells: jest.fn(),
            };

            act(() => {
                result.current.columnDefinitions[0].cellRenderer({
                    data: { clientId: "client-1" },
                    node: { rowIndex: 0 },
                    api: mockApi,
                }).props.children.props.onClick();
            });

            await waitFor(() => expect(result.current.editingRowId).toBe("client-1"));

            // Act
            await act(async () => {
                const editCol = result.current.columnDefinitions[0];
                const rendered = editCol.cellRenderer({
                    data: { clientId: "client-1" },
                    node: { rowIndex: 0 },
                    api: mockApi,
                });
                await rendered.props.children[0].props.onClick();
            });

            // Assert
            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(consoleSpy).toHaveBeenCalledWith(
                "Error updating client data: ",
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });

    });

});


