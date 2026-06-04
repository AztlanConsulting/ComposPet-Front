import React from "react";
import SelectionInput from "../atoms/selectionInput";

import '../../css/molecules/yesNoQuestion.css'

/**
 * Molécula para preguntas binarias de Sí/No.
 * Renderiza una pregunta y dos opciones mutuamente excluyentes
 * utilizando el átomo `SelectionInput`.
 *
 * @param {string} id - Identificador base del grupo de opciones.
 * @param {string} question - Texto de la pregunta.
 * @param {boolean} value - Valor actual de la respuesta.
 * @param {Function} onChange - Función que actualiza el valor booleano.
 * @param {string} [error=""] - Mensaje de error asociado al campo.
 * @returns {JSX.Element} Grupo de selección Sí/No.
 */

export default function YesNoQuestion({
    id, 
    question, 
    value,
    onChange,
    error = "",
}){

    return (
        <div className="yes-no-question">
            <p className="yes-no-question-title">
                {question}
            </p>
            <div className="yes-no-question-options">
                <label className="yes-no-question-option" htmlFor={`${id}-yes`}>
                    <SelectionInput
                        id={`${id}-yes`}
                        type="radio"
                        name={id}
                        value="si"
                        checked={value === true}
                        onChange={() => onChange(true)}
                    />
                    <span>Si</span>
                </label>

                <label className="yes-no-question-option" htmlFor={`${id}-no`}>
                    <SelectionInput
                        id={`${id}-no`}
                        type="radio"
                        name={id}
                        value="no"
                        checked={value === false}
                        onChange={() => onChange(false)}
                    />
                    <span>No</span>
                </label>

            </div>
            {error && (
                <p className="yes-no-question-error">
                    {error}
                </p>
            )}
        </div>
    );

}