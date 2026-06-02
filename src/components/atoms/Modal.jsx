import React from 'react';
import '../../css/atoms/modal.css';

/**
 * Componente Modal reutilizable para mostrar contenido superpuesto.
 * Recibe un prop `isOpen` para controlar su visibilidad, un callback `onClose`
 * para cerrar el modal, y `children` para renderizar el contenido dentro del modal.
 * El prop `className` permite agregar clases CSS adicionales para personalizar el estilo del modal.
 * 
 * @prop {boolean} isOpen - Controla la visibilidad del modal. Si es `false`, el modal no se renderiza.
 * @prop {function} onClose - Callback que se ejecuta al hacer clic en el botón de cierre del modal.
 * @prop {React.ReactNode} children - Contenido que se renderiza dentro del modal.
 * @prop {string} [className=""] - Clases CSS adicionales para personalizar el estilo del modal.
 * @returns {JSX.Element|null} El componente Modal renderizado si `isOpen` es `true`, o `null` si es `false`.xw
 */

export default function Modal({
    isOpen = false,
    onClose = () => {},
    children,
    className = '',
}) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <section className={`modal-card ${className}`}>
            <button
                type="button"
                className="modal-close-button"
                onClick={onClose}
                aria-label="Cerrar modal"
            >
                <i className="bi bi-x-lg"></i>
            </button>

                {children}
            </section>
        </div>
    );
}