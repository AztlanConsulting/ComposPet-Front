import React from 'react';
import "../../css/atoms/counters.css";

export default function Counters({ 
    label = '',
    value = 0,
}) {
    return (
        <div className='counters-container'>
            <span className="counters-label">{label}</span>
            <span className="counters-value">{value}</span>
        </div>
    );
}