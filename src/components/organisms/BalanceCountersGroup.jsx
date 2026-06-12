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
    icon='',
    color="",
    iconSize="",
}) {
    return (
        <div className="balance-counters-group">
            {counters.map((counter) => (
                <BalanceCounter
                    key={counter.title}
                    title={counter.title}
                    favorSubtitle={counter.favorSubtitle}
                    favorBalance={counter.favorBalance}
                    favorVariant={counter.favorVariant}
                    pendingSubtitle={counter.pendingSubtitle}
                    pendingBalance={counter.pendingBalance}
                    pendingVariant={counter.pendingVariant}
                    icon={counter.icon}
                    color={counter.color}
                    iconSize={counter.iconSize}
                />
            ))}
        </div>
    );
}