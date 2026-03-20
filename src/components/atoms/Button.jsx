import React from 'react'
import "../../css/button.css";

// sizes: ["mini", "small", "medium", "large", "extra-lg"]
// type: ["info", "cancel", "accept", "login", "warning", "plus-min"]

export default function Button({
    size = "medium",
    type = "accept",
    className = "",
    onClick = () => {},
    children,
}) {
    return (
        <button className={`button ${size} ${type} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
}
