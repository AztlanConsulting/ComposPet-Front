import React, { useState, useRef, useEffect } from 'react';
import Label from '../atoms/Label';
import arrowIcon from '../../public/icons/arrow.svg'
import "../../css/molecules/dropdownInput.css";

export default function DropdownInput({ 
    id, 
    size, 
    children, 
    value, 
    onChange, 
    options,
    className="",
    error 
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find(opt => opt.value === value)?.label || 'Seleccionar...';

    function handleSelect(optValue) {
        onChange({ target: { value: optValue } }); 
        setOpen(false);
    }

    return (
        <div className={className} ref={ref}>
            <Label id={id} size={size} className="label-dropdown">
                {children}
            </Label>

            {/* Trigger */}
            <div
                className={`
                    formSelect ${open ? 'open' : ''} 
                    ${error ? 'dropdown-error' : ''}
                `}
                onClick={() => setOpen(!open)}
            >
                <span className='selectedLabel'>
                    {selectedLabel}
                </span>
                <img
                    src={arrowIcon}
                    className={`selectArrow ${open ? 'rotated' : ''}`}
                    alt=""
                />
            </div>

            {/* Opciones */}
            {open && (
                <ul className="selectOptions">
                    {options.map((opt, i) => (
                        <li
                            key={i}
                            className={`selectOption ${opt.value === value ? 'selected' : ''}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}

            {error && <p className="error-message">{error}</p>}
        </div>
    );
}