import React from "react";
import "../../css/atoms/toggle.css";
import '../../css/tokens/colors.css'

/**
    Toggle switch component.
 */
export default function Toggle({
    id,
    checked,
    onChange,
    disabled = false,
    size = "sm",
    activeColor = "var(--color-green-secondary)",
    inactiveColor = "var(--color-green-tertiary)",
    className = "",
}) {
    return (
        <label
            className={`toggle-switch ${size} ${className}`}
            style={{
                "--toggle-active-color": activeColor,
                "--toggle-inactive-color": inactiveColor,
            }}
        >
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
            />

            <span className="toggle-slider"></span>
        </label>
    );
}