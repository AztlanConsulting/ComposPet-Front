import React from 'react';
import "../../css/atoms/counters.css";
import "../../css/molecules/countersGroup.css";
import Counters from '../atoms/Counters';

/**
 * Componente que agrupa múltiples contadores para mostrar varias métricas o 
 * estadísticas relacionadas.
 * 
 * @param {Array<{label: string, value: number}>} [counters=[]] - Lista de objetos
 * con etiqueta y valor para cada contador.
 * @return {JSX.Element} Componente que renderiza un grupo de contadores.
 */
export default function CountersGroup({ counters = [] }) {
    return (
        <div className="counters-group">
            {counters.map((counter, index) => (
                <Counters
                    key={index}
                    label={counter.label}
                    value={counter.value}
                />
            ))}
        </div>
    );
}