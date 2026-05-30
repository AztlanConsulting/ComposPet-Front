import React from 'react';
import MetricHeader from '../../components/molecules/MetricHeader';
import "../../css/atoms/counters.css";

/**
 * Componente de contador reutilizable para mostrar métricas o estadísticas clave.
 * 
 * @param {string} [label=""] - Etiqueta descriptiva del contador.
 * @param {number} [value=0] - Valor numérico a mostrar en el contador.
 * @return {JSX.Element} Componente de contador con etiqueta y valor.
 */
export default function Counters({ 
    label = '',
    value = 0,
    icon = '',
    color = '',
    iconSize = 'medium',
}) {
    return (
        <div className='counters-container'>
            <MetricHeader
                text={label}
                iconName={icon}
                color={color}
                size={iconSize}
                className='counter-label'
            />
            <span className="counters-value">{value}</span>
        </div>
    );
}