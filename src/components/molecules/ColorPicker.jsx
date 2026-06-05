import React from 'react';
import '../../css/molecules/colorPicker.css';

export default function ColorPicker({
    colors = [],
    selectedColor = '',
    onSelectColor = () => {},
}) {
    return (
        <div className="color-picker">
            {colors.map((color) => (
                <button
                    key={color}
                    type="button"
                    className={`color-picker-option ${
                        selectedColor === color ? 'selected' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => onSelectColor(color)}
                    aria-label={`Seleccionar color ${color}`}
                />
            ))}
        </div>
    );
}