import React from 'react';
import '../../css/atoms/progressBar.css';

/**
 * Barra de progreso personalizada.
 *
 * @param {number} progressPercentage - Porcentaje de avance a mostrar.
 * @param {number} currentStep - Paso actual del formulario.
 * @param {number} totalSteps - Total de pasos del formulario.
 * @param {string} [className=""] - Clases CSS adicionales.
 * @returns {JSX.Element} Barra de progreso con ancho dinámico.
 */
export default function ProgressBar({
    progressPercentage,
    currentStep,
    totalSteps,
    className = '',
}) {
    return (
        <div
            className={`cp-progress-bar ${className}`}
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={`Paso ${currentStep} de ${totalSteps}`}
        >
            <div
                className="cp-progress-bar-fill"
                style={{ width: `${progressPercentage}%` }}
            />
        </div>
    );
}