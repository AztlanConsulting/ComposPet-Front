import React from 'react'
import "../../css/input.css";

// sizes: ["sm", "md", "lg", "xl"]
// type: ["text", "password", "submit", "checkbox", "radio", "email", "number", "date, "file, "url", "range", "color", "hidden"]

export default function Input({
    placeholder = "",
    size = "lg",
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
