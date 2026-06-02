import React, { useState } from 'react';
import Icon from "../atoms/Icon";
import CopyBubble from "../atoms/CopyBubble";

import "../../css/atoms/icon.css";
import "../../css/molecules/copyLink.css";

/**
 * Componente reutilizable para mostrar un enlace con funcionalidad de copiado.
 * Permite al usuario copiar un enlace al portapapeles y muestra un mensaje de 
 * feedback en formato de burbuja.
 * @param {string} [link=""] - Enlace que se copiará al portapapeles.
 * @param {string} [text=""] - Texto / titulo que va a un lado de ícono.
 * @param {string} [bubbleMessage=""] - Mensaje de confirmación a mostrar en la
 *  burbuja después de copiar.
 * @return {JSX.Element} Componente de enlace con funcionalidad de copiado.
 */
export default function CopyLink({
    link = '',
    text = '',
    bubbleMessage = '',
}) {
    const [copied, setCopied] = useState(false);
    const [bubbleType, setBubbleType] = useState("success");
    const [currentBubbleMessage, setCurrentBubbleMessage] = useState(bubbleMessage);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);

            setBubbleType("success");
            setCurrentBubbleMessage(bubbleMessage);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);

        } catch (err) {

            setBubbleType("error");
            setCurrentBubbleMessage("¡No se pudo copiar!");

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);

            console.error('Error al copiar:', err);
        }
    };

    return (
        <div className='link-formulario'>
            <span className="copy-link-text">{text}</span>
            <div className="icon-button">
                <div className="copy-icon-wrapper">

                    {copied && (
                        <CopyBubble
                            bubbleMessage={currentBubbleMessage}
                            type={bubbleType}
                        />
                    )}

                    <Icon
                        className="icon-primary"
                        name="copy"
                        size="medium"
                        color="secondary"
                        onClick={handleCopy}
                    />
                </div>
            </div>
        </div>
    );
}