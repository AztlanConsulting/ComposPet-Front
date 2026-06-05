import React, { forwardRef } from 'react';
import "../../css/atoms/input.css";

/**
 * Campo de entrada de datos reutilizable.
 * Renderiza un `<input>` HTML estilizado con clases CSS dinámicas
 * según el tamaño y tipo especificados.
 *
 * @param {string} [placeholder=""] - Texto de marcador de posición.
 * @param {"sm"|"md"|"lg"|"xl"} [size="lg"] - Tamaño visual del input.
 * @param {string} [className=""] - Clases CSS adicionales.
 * @param {string} [id=""] - Identificador del input, necesario para vincularlo con un `<label>`.
 * @param {"text"|"password"|"submit"|"checkbox"|"radio"|"email"|"number"|"date"|"file"|"url"|"range"|"color"|"hidden"} [type="text"] - Tipo de input HTML.
 * @param {Function} [onChange=()=>{}] - Manejador del evento de cambio de valor.
 * @returns {JSX.Element} Elemento `<input>` estilizado.
 */

const Input = forwardRef(({
    placeholder = "",
    size = "lg",
    className = "",
    id = "",
    type = "text",
    onChange = () => {},
    onFocus = () => {},
    onBlur = () => {},
    onKeyDown = () => {},
    value = "",
    maxLength,
}, ref) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            id={id}
            className={`input ${size} ${className}`}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            value={value}
            maxLength={maxLength}
            ref={ref}
        />
    );
});

export default Input;
