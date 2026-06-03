import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ButtonActionAlert from "../../components/Template/ButtonActionAlert";
import ConfirmAlert from "../../components/Template/confirmationAlert";

jest.mock("../../components/Template/confirmationAlert", () =>
    jest.fn(() => Promise.resolve())
);

describe("ButtonActionAlert", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.open = jest.fn();
    });

    test("ejecuta onAction al hacer clic", async () => {
        const onAction = jest.fn().mockResolvedValue(null);

        render(
            <ButtonActionAlert onAction={onAction}>
                Generar mensajes
            </ButtonActionAlert>
        );

        fireEvent.click(screen.getByRole("button", { name: "Generar mensajes" }));

        await waitFor(() => {
            expect(onAction).toHaveBeenCalledTimes(1);
        });
    });

    test("muestra alerta de éxito cuando la acción termina bien", async () => {
        const onAction = jest.fn().mockResolvedValue(null);

        render(
            <ButtonActionAlert
                onAction={onAction}
                successMessage="Mensajes generados exitosamente"
            >
                Generar mensajes
            </ButtonActionAlert>
        );

        fireEvent.click(screen.getByRole("button", { name: "Generar mensajes" }));

        await waitFor(() => {
            expect(ConfirmAlert).toHaveBeenCalledWith({
                title: "Mensajes generados exitosamente",
                icon: "success",
                confirmText: "Aceptar",
                showCancelButton: false,
            });
        });
    });

    test("muestra alerta de error cuando la acción falla", async () => {
        const onAction = jest.fn().mockRejectedValue(new Error("Error inesperado"));

        render(
            <ButtonActionAlert
                onAction={onAction}
                errorMessage="Revisa que las solicitudes estén completas y agrega un horario a cada una"
            >
                Generar mensajes
            </ButtonActionAlert>
        );

        fireEvent.click(screen.getByRole("button", { name: "Generar mensajes" }));

        await waitFor(() => {
            expect(ConfirmAlert).toHaveBeenCalledWith({
                title: "No se pudo completar la acción",
                text: "Revisa que las solicitudes estén completas y agrega un horario a cada una",
                icon: "error",
                confirmText: "Aceptar",
                showCancelButton: false,
            });
        });
    });

    test("usa el mensaje específico cuando no hay solicitudes para generar mensajes", async () => {
        const onAction = jest
            .fn()
            .mockRejectedValue(new Error("No hay solicitudes para generar mensajes"));

        render(
            <ButtonActionAlert
                onAction={onAction}
                errorMessage="Revisa que las solicitudes estén completas y agrega un horario a cada una"
            >
                Generar mensajes
            </ButtonActionAlert>
        );

        fireEvent.click(screen.getByRole("button", { name: "Generar mensajes" }));

        await waitFor(() => {
            expect(ConfirmAlert).toHaveBeenCalledWith({
                title: "No se pudo completar la acción",
                text: "No hay solicitudes para generar mensajes",
                icon: "error",
                confirmText: "Aceptar",
                showCancelButton: false,
            });
        });
    });

    test("no llama window.open si no hay resultado", async () => {
        const onAction = jest.fn().mockResolvedValue(null);

        render(
            <ButtonActionAlert onAction={onAction}>
                Generar mensajes
            </ButtonActionAlert>
        );

        fireEvent.click(screen.getByRole("button", { name: "Generar mensajes" }));

        await waitFor(() => {
            expect(onAction).toHaveBeenCalledTimes(1);
        });

        expect(window.open).not.toHaveBeenCalled();
    });

    test("llama window.open si onAction devuelve una URL", async () => {
        const onAction = jest
            .fn()
            .mockResolvedValue("https://docs.google.com/spreadsheets/test");

        render(
            <ButtonActionAlert onAction={onAction}>
                Generar mensajes
            </ButtonActionAlert>
        );

        fireEvent.click(screen.getByRole("button", { name: "Generar mensajes" }));

        await waitFor(() => {
            expect(window.open).toHaveBeenCalledWith(
                "https://docs.google.com/spreadsheets/test",
                "_blank"
            );
        });
    });

    test("evita doble clic mientras está cargando", async () => {
        let resolveAction;

        const onAction = jest.fn(
            () =>
                new Promise((resolve) => {
                    resolveAction = resolve;
                })
        );

        render(
            <ButtonActionAlert onAction={onAction}>
                Generar mensajes
            </ButtonActionAlert>
        );

        const button = screen.getByRole("button", { name: "Generar mensajes" });

        fireEvent.click(button);
        fireEvent.click(button);

        expect(onAction).toHaveBeenCalledTimes(1);

        resolveAction(null);

        await waitFor(() => {
            expect(ConfirmAlert).toHaveBeenCalled();
        });
    });
});