import React from 'react';
import '../../css/atoms/balanceItem.css';

/**
 * Muestra una etiqueta y un valor monetario.
 *
 * @param {string} subtitle - Texto descriptivo del saldo.
 * @param {string} value - Valor monetario a mostrar.
 * @param {'positive' | 'negative'} variant - Estilo visual del valor.
 * @returns {JSX.Element}
 */
export default function BalanceItem({
    subtitle = '',
    value = '',
    variant = 'positive',
}) {

    const numericValue = Number(
        String(value)
            .replace('$', '')
            .replace(',', '')
            .trim()
    );

    const resolvedVariant =
        numericValue === 0
            ? 'neutral'
            : variant;

    return (
        <div className="balance-item">

            <span className="balance-item-subtitle">
                {subtitle}
            </span>

            <span
                className={`
                    balance-item-value
                    balance-item-value-${resolvedVariant}
                `}
            >
                {value}
            </span>

        </div>
    );
}