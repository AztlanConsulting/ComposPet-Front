import React from 'react';
import '../../css/atoms/selectionInput.css';

/**
 * Input de selección multiple para checkbox y radio.
 * Renderiza un `<input>` HTML controlado con soporte para estado seleccionado,
 * agrupación por nombre y valor asociado.
 *
 * @param {string} [id=""] - Id del input
 * @param {"radio"|"checkbox"} [type="radio"] - Tipo de input de selección
 * @param {string} [name=""] - Nombre del grupo al que pertenece el input
 * @param {string} [value=""] - Valor asociado a la opción
 * @param {boolean} [checked=false] - Indica si la opción está seleccionada
 * @param {Function} [onChange=()=>{}] - Manejador del cambio de selección
 * @param {string} [className=""] - Clases CSS adicional
 * @param {boolean} [disabled=false] - Indica si el input está deshabilitado
 * @returns {JSX.Element} Elemento `<input>` de selección
 */

export default function SelectionInput({
    id = "",
    type = "radio",
    name = "",
    value = "",
    checked = false,
    onChange = () => {},
    className = "",
    disabled = false,
}) {
    return (
        <input
            id={id}
            type={type}
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            className={`selection-input ${className}`}
            disabled={disabled}
        />
    );
}