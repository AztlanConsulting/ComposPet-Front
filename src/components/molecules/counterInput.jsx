import React from 'react';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';

import '../../css/molecules/counterInput.css';

/**
 * Molécula para seleccionar una cantidad mediante botones
 * de incremento y decremento.
 *
 * @param {string} question - Texto de la pregunta.
 * @param {number} value - Valor actual del contador.
 * @param {Function} onIncrement - Función para incrementar el valor.
 * @param {Function} onDecrement - Función para decrementar el valor.
 * @param {string} [error=""] - Mensaje de error asociado al campo.
 * @returns {JSX.Element} Contador visual con controles y mensaje de error.
 */
export default function CounterInput({
    question,
    value,
    onIncrement,
    onDecrement,
    error = '',
}) {
    return (
        <div className="counter-input">
            <p className="counter-input-title">
                {question}
            </p>

            <div className="counter-input-controls">
                <Button
                    type="button"
                    size="mini"
                    csstype="plus-min"
                    onClick={onDecrement}
                >
                    <Icon name="minus" size="small" color="primary" />
                </Button>

                <span className="counter-input-value">
                    {value}
                </span>

                <Button
                    type="button"
                    size="mini"
                    csstype="plus-min"
                    onClick={onIncrement}
                >
                    <Icon name="plus" size="small" color="primary" />
                </Button>
            </div>

            {error && (
                <p className="counter-input-error">
                    {error}
                </p>
            )}
        </div>
    );
}