import React from 'react';
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
                <button
                    type="button"
                    className="inventory-modal-close"
                    onClick={onClose}
                >
                    ×
                </button>
                {children}
            </section>
        </div>
    );
}