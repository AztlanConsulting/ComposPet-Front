import React from 'react'
import "../../css/image.css";

export default function Image({
    src = "",
    alt = "",
    size = "medium",
    variant = "normal",  // "normal" | "square" | "circle"
    className = "",
}) {
    return (
        <img
        src={src}
        alt={alt}
        className={`image ${size} ${variant} ${className}`}
        />
    );
}