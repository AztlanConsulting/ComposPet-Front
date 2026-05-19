import React from 'react';
import BalanceItem from '../atoms/BalanceItem';

import '../../css/molecules/balanceCounter.css';

/**
 * Agrupa el título y los contadores de saldo.
 *
 * @param {string} title
 * @param {string} favorSubtitle
 * @param {number|string} favorBalance
 * @param {string} pendingSubtitle
 * @param {number|string} pendingBalance
 * @returns {JSX.Element}
 */
export default function BalanceCounter({
    title = '',

    favorSubtitle = '',
    favorBalance = 0,

    pendingSubtitle = '',
    pendingBalance = 0,
}) {
    return (
        <div className="balance-counter">

            <h2 className="balance-counter-title">
                {title}
            </h2>

            <div className="balance-counter-items">

                <BalanceItem
                    subtitle={favorSubtitle}
                    value={favorBalance}
                    variant="positive"
                />

                <BalanceItem
                    subtitle={pendingSubtitle}
                    value={pendingBalance}
                    variant="negative"
                />

            </div>

        </div>
    );
}