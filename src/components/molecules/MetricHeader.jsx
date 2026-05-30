/**
 * Encabezado para métricas compuesto por ícono y texto.
 *
 * @param {string} text
 * @param {string} iconName
 * @param {string} className
 * @param {string} color
 * @param {string} iconSize
 * @returns {JSX.Element}
 */

import React from 'react';
import Icon from '../atoms/Icon';

import '../../css/molecules/metricHeader.css';

export default function MetricHeader({
    text = '',
    iconName = '',
    className = '',
    color = '',
    iconSize = 'medium',
}) {
    return (
        <div className={`metricRow ${className}`}>
            <Icon
                name={iconName}
                size={iconSize}
                color={color}
            />

            <p className="metricText">
                {text}
            </p>
        </div>
    );
}