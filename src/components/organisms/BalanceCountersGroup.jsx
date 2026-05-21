import React from 'react';
import BalanceCounter from '../molecules/BalanceCounter';
import '../../css/organisms/balanceCountersGroup.css';

/**
 * Contenedor principal para mostrar múltiples bloques de saldo.
 *
 * @param {Array} counters - Lista de contadores de saldo.
 * @returns {JSX.Element}
 */
export default function BalanceCountersGroup({
    counters = [],
}) {
    return (
        <div className="balance-counters-group">
            {counters.map((counter) => (
                <BalanceCounter
                    key={counter.title}
                    title={counter.title}
                    favorSubtitle={counter.favorSubtitle}
                    favorBalance={counter.favorBalance}
                    pendingSubtitle={counter.pendingSubtitle}
                    pendingBalance={counter.pendingBalance}
                />
            ))}
        </div>
    );
}