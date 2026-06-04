import React from "react";
import "../../css/atoms/toggle.css";
import '../../css/tokens/colors.css'

/**
 * Componente de interruptor visual reutilizable.
 *
 * Permite representar un estado booleano mediante un switch interactivo.
 * Soporta personalización de tamaño, colores y estado deshabilitado.
 * @param {string} id - Identificador único del input toggle.
 * @param {boolean} checked - Estado actual del switch.
 * @param {Function} onChange - Función ejecutada al cambiar el estado.
 * @param {boolean} [disabled=false] - Indica si el switch está deshabilitado.
 * @param {string} [size="sm"] - Tamaño visual del toggle.
 * @param {string} [activeColor="var(--color-green-secondary)"] - Color del toggle cuando está activo.
 * @param {string} [inactiveColor="var(--color-green-tertiary)"] - Color del toggle cuando está inactivo.
 * @param {string} [className=""] - Clase CSS adicional para estilos personalizados.
 *
 * @returns {JSX.Element} Componente toggle renderizado.
 */
export default function Toggle({
    id,
    checked,
    onChange,
    disabled = false,
    size = "sm",
    activeColor = "var(--color-green-secondary)",
    inactiveColor = "var(--color-green-tertiary)",
    className = "",
}) {
    return (
        <span
            className={`toggle-switch ${size} ${className}`}
            style={{
                "--toggle-active-color": activeColor,
                "--toggle-inactive-color": inactiveColor,
            }}
        >
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
            />

            <label htmlFor={id} className="toggle-slider"></label>
        </span>
    );
}