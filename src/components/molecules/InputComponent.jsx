import Input from "../atoms/Input";
import Label from "../atoms/Label";
import React, { forwardRef, useState } from 'react';
import Icon from '../../components/atoms/Icon';

import "../../css/molecules/inputComponent.css"


/**
 * Componente de input con label asociado.
 * Combina los átomos Label e Input en un contenedor unificado,
 * garantizando la asociación semántica entre ambos mediante el atributo `id`.
 *
 * @param {string} [placeholder=""] - Texto de marcador de posición dentro del input.
 * @param {"sm"|"md"|"lg"|"xl"} [size="md"] - Tamaño del input y la etiqueta.
 * @param {string} [id=""] - Identificador que vincula el Label con el Input. Si se omite, el Label mostrará un error visual.
 * @param {"text"|"password"|"email"|"number"|"date"|"file"|"url"|"checkbox"|"radio"|"submit"|"range"|"color"|"hidden"} [type="text"] - Tipo de input HTML.
 * @param {string} [classNameLabel=""] - Clases CSS adicionales para el Label.
 * @param {string} [classNameInput=""] - Clases CSS adicionales para el Input.
 * @param {Function} [onChange=()=>{}] - Manejador del evento de cambio del input.
 * @param {React.ReactNode} children - Contenido de texto de la etiqueta.
 * @returns {JSX.Element} Contenedor con Label e Input vinculados.
 */
const InputComponent = forwardRef(({
    placeholder = "",
    size = "md",
    id = "",
    type = "text",
    classNameLabel = "",
    classNameInput = "",
    onChange = () => {},
    value = "",
    error = "",
    children,
}, ref) => { 
    const [showPassword, setShowPassword] = useState(false);

    const inputType =
        type === "password"
            ? (showPassword ? "text" : "password")
            : type;

    return (
        <div className="mt-2">
            <Label size={size} id={id} className={classNameLabel}>
                {children}
            </Label>

            <div className="input-container">


                <Input
                    placeholder={placeholder}
                    id={id}
                    size={size}
                    type={inputType}
                    onChange={onChange}
                    className={classNameInput}
                    value={value}
                    ref={ref}
                />

                {type === "password" && (
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ?  <Icon name="eyeOpened" size="small" /> : <Icon name="eyeClosed" size="small" />}
                    </button>
                )}

            </div>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}
        </div>
    );
});

export default InputComponent;