import React from 'react';
import "../../css/atoms/copyBubble.css";

/**
 * Mensaje en formato de burbuja reutilizable para mostrar feedback al usuario 
 * después de una acción de copiado.
 * El mensaje es personalizable y puede adaptarse a diferentes situaciones según 
 * el contexto de uso.
 *
 * @param {string} [bubbleMessage=""] - Mensaje a mostrar dentro de la burbuja.
 * @return {JSX.Element} Componente de burbuja de mensaje de copiado.
 */
export default function CopyBubble({
    bubbleMessage = '',
    isError = false,
}) {
    return (
        <div className={`copy-bubble ${isError ? 'error' : 'success'}`}>
            {bubbleMessage}
        </div>
    );
}