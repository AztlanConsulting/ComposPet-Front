import React from 'react';
import '../../css/Template/formCard.css';

/**
 * Contenedor reutilizable para las moleculas de las vistas del Formulario de solicitud de recolección
 * Envuelve contenido variable dentro de una tarjeta responsiva con borde y sombra.
 *
 * @param {React.ReactNode} children - Contenido interno del contenedor.
 * @param {string} [className=""] - Clases CSS adicionales.
 * @returns {JSX.Element}
 */
export default function FormCard({ children, className = '' }) {
    return (
        <section className={`form-card ${className}`}>
            {children}
        </section>
    );
}