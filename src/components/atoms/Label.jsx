import React from 'react'
import "../../css/label.css";

export default function Label({
    id, 
    size = "lg", 
    className = "", 
    children,
}) {
    return (
        <label
            htmlFor={id}
            className={`label ${size} ${className} ${id ? "" : "text-danger"}`}
        >
            {id ? children : "Label ERROR: Label doesnt have an id"}
        </label>
    );
}
