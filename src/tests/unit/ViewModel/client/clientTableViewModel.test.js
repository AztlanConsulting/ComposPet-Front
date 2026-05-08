
jest.mock("../../../../di/admin/clientTableDependencies", () => ({
    getTableUseCase: {
        execute: jest.fn(),
    },

    getRoutesUseCase: {
        execute: jest.fn(),
    },

    updateClientUseCase: {
        execute: jest.fn(),
    },
}));

jest.mock("../../../../components/Template/AceptAlert", () =>
    jest.fn().mockResolvedValue(true)
);

jest.mock("../../../../components/Template/ProblemAlert", () =>
    jest.fn().mockResolvedValue(true)
);

import { renderHook, waitFor, act } from "@testing-library/react";

import useClientTableViewModel
    from "../../../../presentation/viewmodels/clientTableViewModel";

import AceptAlert
    from "../../../../components/Template/AceptAlert";

import * as dependencies
    from "../../../../di/admin/clientTableDependencies";


describe("useClientTableViewModel", () => {

    beforeEach(() => {

        jest.clearAllMocks();

        dependencies.getTableUseCase.execute
            .mockResolvedValue([]);

        dependencies.getRoutesUseCase.execute
            .mockResolvedValue([]);

        dependencies.updateClientUseCase.execute
            .mockResolvedValue({
                success: true,
            });
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

        dependencies.getTableUseCase.execute
            .mockResolvedValue(mockData);

        // Act
        let result;

        await act(async () => {
            ({ result } = renderHook(() =>
                useClientTableViewModel()
            ));
        });

        // Assert
        await waitFor(() => {
            expect(result.current.clientList.length)
                .toBe(1);
        });

        expect(dependencies.getTableUseCase.execute)
            .toHaveBeenCalled();

        expect(result.current.clientList)
            .toEqual(mockData);

        expect(result.current.loading)
            .toBe(false);
    });

    it("Maneja error al cargar clientes", async () => {

        // Arrange
        dependencies.getTableUseCase.execute
            .mockRejectedValue(
                new Error("Error al cargar clientes")
            );

        const consoleSpy = jest
            .spyOn(console, "log")
            .mockImplementation(() => {});

        // Act
        let result;

        await act(async () => {
            ({ result } = renderHook(() =>
                useClientTableViewModel()
            ));
        });

        // Assert
        await waitFor(() => {
            expect(result.current.loading)
                .toBe(false);
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

        dependencies.getTableUseCase.execute
            .mockImplementation(() =>
                new Promise((resolve) => {
                    resolvePromise = resolve;
                })
            );

        // Act
        const { result } = renderHook(() =>
            useClientTableViewModel()
        );

        await waitFor(() => {
            expect(result.current.loading)
                .toBe(true);
        });

        await act(async () => {
            resolvePromise([]);
        });

        await waitFor(() => {
            expect(result.current.loading)
                .toBe(false);
        });

        // Assert
        expect(dependencies.getTableUseCase.execute)
            .toHaveBeenCalledTimes(1);
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

        expect(
            colDef.tooltipValueGetter({ value: "test" })
        ).toBe("test");
    });


    describe("getRoutes", () => {

        it("carga correctamente la lista de rutas", async () => {

            // Arrange
            const mockRoutes = [
                { id_ruta: 1, dia_ruta: "Lunes" },
                { id_ruta: 2, dia_ruta: "Martes" },
            ];

            dependencies.getRoutesUseCase.execute
                .mockResolvedValue(mockRoutes);

            // Act
            let result;

            await act(async () => {
                ({ result } = renderHook(() =>
                    useClientTableViewModel()
                ));
            });

            // Assert
            await waitFor(() => {
                expect(result.current.loading)
                    .toBe(false);
            });

            expect(dependencies.getRoutesUseCase.execute)
                .toHaveBeenCalled();
        });

        it("maneja error al cargar rutas", async () => {

            // Arrange
            dependencies.getRoutesUseCase.execute
                .mockRejectedValue(
                    new Error("Error rutas")
                );

            const consoleSpy = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});

            // Act
            let result;

            await act(async () => {
                ({ result } = renderHook(() =>
                    useClientTableViewModel()
                ));
            });

            // Assert
            await waitFor(() => {
                expect(result.current.loading)
                    .toBe(false);
            });

            expect(consoleSpy).toHaveBeenCalledWith(
                "Error loading routes list: ",
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });

    });


    describe("handleEdit", () => {

        it("establece editingRowId al hacer click en editar", async () => {

            // Arrange
            const { result } = renderHook(() =>
                useClientTableViewModel()
            );

            await waitFor(() =>
                expect(result.current.loading)
                    .toBe(false)
            );

            const mockParams = {
                data: { clientId: "client-1" },
                node: { rowIndex: 0 },
                api: { startEditingCell: jest.fn() },
            };

            // Act
            act(() => {

                const editCol =
                    result.current.columnDefinitions[0];

                const rendered =
                    editCol.cellRenderer(mockParams);

                rendered.props.children.props.onClick();
            });

            // Assert
            await waitFor(() => {
                expect(result.current.editingRowId)
                    .toBe("client-1");
            });
        });

        it("no permite editar si ya hay una fila en edición", async () => {

            // Arrange
            const { result } = renderHook(() =>
                useClientTableViewModel()
            );

            await waitFor(() =>
                expect(result.current.loading)
                    .toBe(false)
            );

            const mockApi1 = {
                startEditingCell: jest.fn()
            };

            const mockApi2 = {
                startEditingCell: jest.fn()
            };

            // Act
            act(() => {

                result.current.columnDefinitions[0]
                    .cellRenderer({
                        data: { clientId: "client-1" },
                        node: { rowIndex: 0 },
                        api: mockApi1,
                    })
                    .props.children.props.onClick();
            });

            await waitFor(() =>
                expect(result.current.editingRowId)
                    .toBe("client-1")
            );

            act(() => {

                result.current.columnDefinitions[0]
                    .cellRenderer({
                        data: { clientId: "client-2" },
                        node: { rowIndex: 1 },
                        api: mockApi2,
                    })
                    .props.children.props.onClick();
            });

            // Assert
            await waitFor(() => {
                expect(result.current.editingRowId)
                    .toBe("client-1");
            });
        });

    });

});