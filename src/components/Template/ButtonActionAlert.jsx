import React, { useState } from "react";
import ConfirmAlert from "./confirmationAlert";
import Button from "../atoms/Button";

/**
 * Componente reutilizable que ejecuta una acción al presionar un botón
 * y muestra una alerta de retroalimentación al usuario.
 */
export default function ButtonActionAlert({
    children = "Generar mensajes",
    successMessage = "",
    errorMessage = "Ocurrió un error al generar los mensajes",
    onAction,
    disabled = false,
    size = "medium",
    csstype = "accept",
    className = "",
}) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        if (disabled || isLoading) return;

        try {
            setIsLoading(true);

            const actionResult = await onAction();

            await ConfirmAlert({
                title: successMessage,
                icon: "success",
                confirmText: "Aceptar",
                showCancelButton: false,
            });

            if (actionResult) {
                window.open(actionResult, "_blank");
            }
        } catch (error) {
            const message =
                error.message === "No hay solicitudes para generar mensajes"
                    ? error.message
                    : errorMessage;

            await ConfirmAlert({
                title: "No se pudo completar la acción",
                text: message,
                icon: "error",
                confirmText: "Aceptar",
                showCancelButton: false,
            });

            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            size={size}
            csstype={csstype}
            className={`button ${className}`}
            onClick={handleClick}
            disabled={disabled || isLoading}
        >
            {isLoading ? "Generando..." : children}
        </Button>
    );
}