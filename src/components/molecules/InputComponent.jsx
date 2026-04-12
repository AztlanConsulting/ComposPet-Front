import React from 'react'
import Input from "../atoms/Input";
import Label from "../atoms/Label";

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
export default function InputComponent({
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
    ref = "", 
})  {
    return (
        <div className="ml-4">
            <Label size={size} id={id} className={classNameLabel}>
                {children}
            </Label>
            <Input
                placeholder={placeholder}
                id={id}
                size={size}
                type={type}
                onChange={onChange}
                className={classNameInput}
                value={value}
                ref={ref}
            />
            {error && (
                <p className='error-message'>
                    {error}
                </p>
            )}
        </div>
    );
}