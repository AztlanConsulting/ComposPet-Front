import React from 'react'
import "../../css/atoms/image.css";

/**
 * Componente de imagen con variantes de tamaño y forma.
 * Aplica clases CSS dinámicas para controlar las dimensiones
 * y el recorte visual de la imagen.
 *
 * @param {string} [src=""] - URL o ruta de la imagen a mostrar.
 * @param {string} [alt=""] - Texto alternativo para accesibilidad. Se recomienda siempre proveerlo.
 * @param {string} [size="medium"] - Clase CSS que define el tamaño de la imagen.
 * @param {"normal"|"square"|"circle"} [variant="normal"] - Variante de forma visual de la imagen.
 * @param {string} [className=""] - Clases CSS adicionales.
 * @returns {JSX.Element} Elemento `<img>` estilizado.
 */

export default function Image({
    src = "",
    alt = "",
    size = "medium",
    variant = "normal",
    className = "",
}) {
    return (
        <img
        src={src}
        alt={alt}
        className={`image ${size} ${variant} ${className}`}
        />
    );
}