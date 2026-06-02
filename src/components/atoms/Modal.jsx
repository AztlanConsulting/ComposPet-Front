import React from 'react';
import Icon from './Icon';
import '../../css/atoms/modal.css';

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
                <Icon
                    name="close"
                    size="small"
                    className="modal-close-button"
                    onClick={onClose}
                    label="Cerrar modal"
                />

                {children}
            </section>
        </div>
    );
}