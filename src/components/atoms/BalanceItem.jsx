import React from 'react';
import '../../css/atoms/balanceItem.css';

/**
 * Muestra una etiqueta y un valor monetario.
 *
 * @param {string} subtitle - Texto descriptivo del saldo.
 * @param {string} value - Valor monetario a mostrar.
 * @returns {JSX.Element}
 */
export default function BalanceItem({
    subtitle = '',
    value = '',
}) {

    const numericValue = Number(
        String(value)
            .replaceAll('$', '')
            .replaceAll(',', '')
            .replaceAll(' ', '')
            .trim()
    );

    const resolvedVariant =
        numericValue === 0
            ? 'neutral'
            : numericValue > 0
                ? 'positive'
                : 'negative';

    return (
        <div className="balance-item">
            <span
                className={`
                    balance-item-value
                    balance-item-value-${resolvedVariant}
                `}
                title={value}
            >
                {value}
            </span>

            <span className="balance-item-subtitle">
                {subtitle}
            </span>

        </div>
    );
}