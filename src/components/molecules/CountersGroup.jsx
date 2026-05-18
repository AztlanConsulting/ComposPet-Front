import React from 'react';
import "../../css/atoms/counters.css";
import "../../css/molecules/countersGroup.css";
import Counters from '../atoms/Counters';

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