import React from 'react';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';

import '../../css/molecules/counterInput.css';

const MAX_COUNTER_VALUE = 20;
const MIN_COUNTER_VALUE = 0;

/**
 * Molécula para seleccionar una cantidad mediante botones
 * de incremento y decremento.
 * o ingresando el valor directamente en un input numérico.
 *
 * @param {string} question - Texto de la pregunta.
 * @param {number} value - Valor actual del contador.
 * @param {Function} onIncrement - Función para incrementar el valor.
 * @param {Function} onDecrement - Función para decrementar el valor.
 * @param {boolean} [disabled=false] - Indica si el contador está deshabilitado.
 * @param {string} [error=""] - Mensaje de error asociado al campo.
 * @returns {JSX.Element} Contador visual con controles y mensaje de error.
 */
export default function CounterInput({
    question,
    value,
    onIncrement,
    onDecrement,
    onChange = () => {},
    disabled = false,
    disabledIncrement = false,
    disabledDecrement = false,
    error = '',
}) {

    const handleInputChange = (event) => {
        onChange(event.target.value);
    };

    const handleInputBlur = () => {
        if (value === '') {
            onChange(MIN_COUNTER_VALUE);
        }
    };
    
    return (
        <div className={`counter-input ${disabled ? 'counter-input-disabled' : ''}`}>
            <p className="counter-input-title">
                {question}
            </p>

            <div className="counter-input-controls">
                <Button
                    type="button"
                    size="mini"
                    csstype="plus-min"
                    className = {disabledDecrement  ? 'counter-input-limit-button' : ''}
                    onClick={onDecrement}
                    disabled={disabled || disabledDecrement}
                >
                    <Icon name="minus" size="small" color="primary" />
                </Button>

                <input
                    type="number"
                    className="counter-input-value"
                    value={value}
                    min={MIN_COUNTER_VALUE}
                    max={MAX_COUNTER_VALUE}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    disabled={disabled}
                />

                <Button
                    type="button"
                    size="mini"
                    csstype="plus-min"
                    className = {disabledIncrement  ? 'counter-input-limit-button' : ''}
                    onClick={onIncrement}
                    disabled={disabled || disabledIncrement}
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