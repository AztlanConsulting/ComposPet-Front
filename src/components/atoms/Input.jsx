import React from 'react'
import "../../css/input.css";

// sizes: ["small", "medium", "large", "xl"]
// type: ["text", "password", "submit", "checkbox", "radio", "email", "number", "date, "file, "url", "range", "color", "hidden"]

export default function Input({
    placeholder = "",
    size = "large",
    className = "",
    id = "",
    type = "text",
    onChange = () => {},
}) {
    return (
        <input
        type={type}
        placeholder={placeholder}
        id={id}
        className={`input ${size} ${className}`}
        onChange={onChange}
        />
    );
}
