import React from 'react';
import BalanceItem from '../atoms/BalanceItem';
import MetricHeader from '../../components/molecules/MetricHeader';

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
    icon="",
    color="",
    iconSize="",
}) {
    return (
        <div className="balance-counter">

            <MetricHeader
                text={title}
                iconName={icon}
                color={color}
                size={iconSize}
            />

            <div className="balance-counter-items">

                <BalanceItem
                    subtitle={favorSubtitle}
                    value={favorBalance}
                />

                <BalanceItem
                    subtitle={pendingSubtitle}
                    value={pendingBalance}
                />

            </div>

        </div>
    );
}