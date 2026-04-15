import React from 'react';
import ProgressBar from '../atoms/ProgressBar';

import '../../css/molecules/progressBarLogic.css';

/**
 * Molécula para mostrar el avance del formulario.
 *
 * @param {number} currentStep - Paso actual del formulario.
 * @param {number} totalSteps - Total de pasos del formulario.
 * @returns {JSX.Element} Sección de progreso del formulario.
 */
export default function ProgressBarLogic({
    currentStep,
    totalSteps,
}) {
    const safeTotalSteps = totalSteps > 0 ? totalSteps : 1;
    const safeCurrentStep = Math.min(Math.max(currentStep, 1), safeTotalSteps);
    const progressPercentage = Math.round((safeCurrentStep / safeTotalSteps) * 100);
    const currentStepLabel = `Paso ${safeCurrentStep}`;

    return (
        <section className="progress-section">
            <span className="progress-section-title">Progreso</span>

            <div className="progress-section-bar-wrapper">
                <span
                    className="progress-section-percentage"
                    style={{ left: `min(calc(${progressPercentage}% - 1.5rem), calc(100% - 2.5rem))` }}
                >
                    {currentStepLabel}
                </span>

                <ProgressBar
                    progressPercentage={progressPercentage}
                    currentStep={safeCurrentStep}
                    totalSteps={safeTotalSteps}
                />
            </div>
        </section>
    );
}