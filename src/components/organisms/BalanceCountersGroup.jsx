import React from 'react';

import BalanceCounter from '../molecules/BalanceCounter';

import '../../css/organisms/balanceCountersGroup.css';

/**
 * Contenedor principal para mostrar múltiples bloques de saldo.
 *
 * @param {Object} routeCounter
 * @param {Object} totalCounter
 * @returns {JSX.Element}
 */
export default function BalanceCountersGroup({
    routeCounter = {},
    totalCounter = {},
}) {
    return (
        <div className="balance-counters-group">

            <BalanceCounter
                title={routeCounter.title}
                favorSubtitle={routeCounter.favorSubtitle}
                favorBalance={routeCounter.favorBalance}
                pendingSubtitle={routeCounter.pendingSubtitle}
                pendingBalance={routeCounter.pendingBalance}
            />

            <BalanceCounter
                title={totalCounter.title}
                favorSubtitle={totalCounter.favorSubtitle}
                favorBalance={totalCounter.favorBalance}
                pendingSubtitle={totalCounter.pendingSubtitle}
                pendingBalance={totalCounter.pendingBalance}
            />

        </div>
    );
}