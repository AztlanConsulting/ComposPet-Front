import React from 'react'
import "../../css/atoms/button.css";

/**
 * Botón reutilizable con variantes de tamaño y tipo visual.
 * Aplica clases CSS dinámicas para controlar la apariencia
 * según el contexto de uso (confirmación, cancelación, alerta, etc.).
 *
 * @param {"mini"|"small"|"medium"|"large"|"extra-lg"} [size="medium"] - Tamaño del botón.
 * @param {"info"|"cancel"|"accept"|"login"|"warning"|"plus-min"} [type="accept"] - Variante visual del botón.
 * @param {string} [className=""] - Clases CSS adicionales.
 * @param {Function} [onClick=()=>{}] - Manejador del evento de clic.
 * @param {React.ReactNode} children - Contenido interno del botón (texto o elementos).
 * @returns {JSX.Element} Elemento `<button>` estilizado.
 */

export default function Button({
    size = " ",
    type = " ",
    className = "",
    onClick = () => {},
    children,
}) {
    return (
        <button className={`button ${size} ${type} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
}
