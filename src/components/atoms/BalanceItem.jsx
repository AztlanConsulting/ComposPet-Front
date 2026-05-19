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
    return (
        <div className="balance-item">
            <span className="balance-item-subtitle">
                {subtitle}
            </span>

            <span className={`balance-item-value balance-item-value-${variant}`}>
                {value}
            </span>
        </div>
    );
}