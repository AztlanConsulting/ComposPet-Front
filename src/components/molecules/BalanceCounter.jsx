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
    favorVariant = null,

    pendingSubtitle = '',
    pendingBalance = 0,
    pendingVariant = null,

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
                    variant={favorVariant}
                />

                <BalanceItem
                    subtitle={pendingSubtitle}
                    value={pendingBalance}
                    variant={pendingVariant}
                />

            </div>

        </div>
    );
}