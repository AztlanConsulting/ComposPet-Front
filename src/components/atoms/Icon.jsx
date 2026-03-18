import React from 'react'
import "../../css/icon.css";

import { ReactComponent as PlusIcon } from '../../public/icons/plus.svg';
import { ReactComponent as MinusIcon } from '../../public/icons/minus.svg';

const icons = {
    plus: PlusIcon,
    minus: MinusIcon,
};

export default function Icon({
    size = "medium",    // small | medium | large
    name = "",
    color = "",
    className = "",
    onClick = null,
    label = "",

}) {

    const IconComponent = icons[name];

    if(!IconComponent) return null;

    const svg = (
        <IconComponent
            className={`icon ${size} ${color} ${className}`}
            aria-hidden={!label}
        />   
    );

    if (onClick){
        return(
            <button
                className={`icon-button ${size} ${color} ${className}`}
                onClick={onClick}
                aria-label={label}
                type="button"
            >
                {svg}
            </button>
        );
    }

    return svg;
}
