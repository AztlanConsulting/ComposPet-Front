import React, { useState } from "react";
import Icon from "../atoms/Icon";
import CopyBubble from "../atoms/CopyBubble";

import "../../css/atoms/icon.css";
import "../../css/molecules/copyLink.css";


/**
 * Componente reutilizable que ejecuta una acción al presionar un ícono
 * y muestra una burbuja de retroalimentación al usuario.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} text - Texto mostrado junto al ícono.
 * @param {string} iconName - Nombre del ícono que será renderizado.
 * @param {string} bubbleMessage - Mensaje exitoso.
 * @param {string} errorMessage - Mensaje error.
 * @param {Function} onAction - Función asíncrona que se ejecuta al hacer clic en el ícono.
 * @returns {JSX.Element} Ícono con burbuja de acción
 */
export default function IconActionBubble({
    text = "Generar mensajes de confirmación",
    iconName = "googleSheets",
    bubbleMessage = "Mensajes generados exitosamente",
    errorMessage = "Ocurrió un error al generar los mensajes",
    onAction,
}) {
    const [showBubble, setShowBubble] = useState(false);
    const [currentBubbleMessage, setCurrentBubbleMessage] = useState(bubbleMessage);

    const handleClick = async () => {
        try {
            const actionResult = await onAction();
            
            setCurrentBubbleMessage(bubbleMessage);
            setShowBubble(true);

            setTimeout(() => {

                if (actionResult) {
                    window.open(actionResult, "_blank");
                }

                setShowBubble(false);
            }, 1000);
        } catch (error) {

            const message = 
                error.message === "No hay solicitudes para generar mensajes"
                    ? error.message
                    : errorMessage;

            setCurrentBubbleMessage(message);
            setShowBubble(true);

            setTimeout(() => {
                setShowBubble(false);
            }, 2000);

            console.error(error);
        }
    };

    return (
        <div className="icon-button">
            <span className="copy-link-text">{text}</span>

            <div className="copy-icon-wrapper">
                {showBubble && (
                    <CopyBubble bubbleMessage={currentBubbleMessage} 
                    isError={currentBubbleMessage !== bubbleMessage} 
                    />
                )}

                <Icon
                    className="icon-primary"
                    name={iconName}
                    size="medium"
                    color="secondary"
                    onClick={handleClick}
                />
            </div>
        </div>
    );
}