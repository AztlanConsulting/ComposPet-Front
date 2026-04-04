import React from 'react'
import "../../css/atoms/label.css";

/**
 * Etiqueta de formulario con validación de accesibilidad.
 * Si no se proporciona un `id`, muestra un mensaje de error visual
 * para alertar al desarrollador sobre la asociación faltante con su input.
 *
 * @param {string} id - Identificador del input al que se asocia mediante `htmlFor`. Su ausencia activa el modo de error.
 * @param {"sm"|"md"|"lg"|"xl"} [size="lg"] - Tamaño visual de la etiqueta.
 * @param {string} [className=""] - Clases CSS adicionales.
 * @param {React.ReactNode} children - Texto o contenido de la etiqueta.
 * @returns {JSX.Element} Elemento `<label>` estilizado, con mensaje de error si falta el `id`.
 */
export default function Label({
    id, 
    size = "lg", 
    className = "", 
    children,
}) {
    return (
        <label
            htmlFor={id}
            className={`label ${size} ${className} ${id ? "" : "text-danger"}`}
        >
            {id ? children : "Label ERROR: Label doesnt have an id"}
        </label>
    );
}
