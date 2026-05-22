import { renderHook, act, waitFor } from "@testing-library/react";
import useClientTableViewModel from "../../../../presentation/viewmodels/clientTableViewModel";

import {
    getTableUseCase,
    getRoutesUseCase,
    getCompostStatusUseCase,
    updateCompostStatusUseCase,
} from "../../../../di/admin/clientTableDependencies";

import ConfirmAlert from "../../../../components/Template/confirmationAlert";
import AceptAlert from "../../../../components/Template/AceptAlert";
import ProblemAlert from "../../../../components/Template/ProblemAlert";

jest.mock("../../../../di/admin/clientTableDependencies", () => ({
    getTableUseCase: {
        execute: jest.fn(),
    },
    getRoutesUseCase: {
        execute: jest.fn(),
    },
    getCompostStatusUseCase: {
        execute: jest.fn(),
    },
    updateCompostStatusUseCase: {
        execute: jest.fn(),
    },
}));

jest.mock("../../../../presentation/viewmodels/utils/clientTableColumnDefinitions", () => ({
    getClientTableColumns: jest.fn(() => []),
}));

jest.mock("../../../../components/Template/confirmationAlert", () => jest.fn());
jest.mock("../../../../components/Template/AceptAlert", () => jest.fn());
jest.mock("../../../../components/Template/ProblemAlert", () => jest.fn());

describe("useClientTableViewModel - composta", () => {

    beforeEach(() => {
        jest.clearAllMocks();

        getTableUseCase.execute.mockResolvedValue([]);
        getRoutesUseCase.execute.mockResolvedValue([]);

        getCompostStatusUseCase.execute.mockResolvedValue({
            status: {
                data: true,
            },
        });

        updateCompostStatusUseCase.execute.mockResolvedValue({});

        ConfirmAlert.mockResolvedValue({
            isConfirmed: true,
        });

        AceptAlert.mockResolvedValue({});
        ProblemAlert.mockResolvedValue({});
    });

    it("debe obtener el estatus de composta correctamente", async () => {

        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.compostStatus).toBe(true);
        });

        expect(getCompostStatusUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it("debe cambiar el estatus de composta correctamente", async () => {

        getCompostStatusUseCase.execute.mockResolvedValue({
            status: {
                data: false,
            },
        });

        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.compostStatus).toBe(false);
        });

        await act(async () => {
            await result.current.handleCompostStatusChange();
        });

        expect(updateCompostStatusUseCase.execute)
            .toHaveBeenCalledWith(true);

        expect(result.current.compostStatus).toBe(true);

        expect(AceptAlert).toHaveBeenCalled();
    });

    it("no debe cambiar el estatus si el usuario cancela", async () => {

        ConfirmAlert.mockResolvedValue({
            isConfirmed: false,
        });

        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.compostStatus).toBe(true);
        });

        await act(async () => {
            await result.current.handleCompostStatusChange();
        });

        expect(updateCompostStatusUseCase.execute)
            .not.toHaveBeenCalled();
    });

    it("debe mostrar error si falla la actualización", async () => {

        updateCompostStatusUseCase.execute.mockRejectedValue(
            new Error("Error updating compost status")
        );

        const { result } = renderHook(() => useClientTableViewModel());

        await waitFor(() => {
            expect(result.current.compostStatus).toBe(true);
        });

        await act(async () => {
            await result.current.handleCompostStatusChange();
        });

        expect(ProblemAlert).toHaveBeenCalledWith({
            title: "Error",
            text: "No se pudo actualizar el estatus de la composta.",
        });
    });
});