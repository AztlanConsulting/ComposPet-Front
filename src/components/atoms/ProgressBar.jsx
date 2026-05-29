import React from 'react';
import '../../css/atoms/progressBar.css';

/**
 * Barra de progreso de círculos.
 *
 * @param {number} currentStep - Paso actual del formulario.
 * @param {Array<string>} steps - pasos.
 * @param {Function} onStepClick - Función para regresar a un paso anterior.
 * @returns {JSX.Element} Step de progreso.
 */
export default function ProgressBar({
    currentStep,
    steps = [],
    onStepClick,
    className = '',
}) {
    return (
        <div
            className={`cp-progress-stepper ${className}`}
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={steps.length}
        >
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isActive = stepNumber === currentStep;
                const isFuture = stepNumber > currentStep;
                const canGoBack = isCompleted;

                return (
                    <div className="cp-progress-step-wrapper" key={step}>
                        <div className="cp-progress-step-content">
                            <button
                                type="button"
                                className={`
                                    cp-progress-step-circle
                                    ${isCompleted ? 'completed' : ''}
                                    ${isActive ? 'active' : ''}
                                    ${isFuture ? 'future' : ''}
                                `}
                                onClick={() => {
                                    if (canGoBack && typeof onStepClick === 'function') {
                                        onStepClick(stepNumber);
                                    }
                                }}
                                disabled={!canGoBack}
                            >
                                {isCompleted ? '✓' : ''}
                            </button>

                            <span className="cp-progress-step-label">
                                {step}
                            </span>
                        </div>

                        {index < steps.length - 1 && (
                            <div
                                className={`
                                    cp-progress-step-line
                                    ${stepNumber < currentStep ? 'completed' : ''}
                                `}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}