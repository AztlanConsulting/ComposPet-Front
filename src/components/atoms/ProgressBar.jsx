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
    steps,
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
            aria-label={`Paso ${currentStep} de ${steps.length}`}
        >
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isActive = stepNumber === currentStep;
                const isFuture = stepNumber > currentStep;
                const canGoBack = isCompleted;

                return (
                    <React.Fragment key={step}>
                        <div
                            className="cp-progress-step-content"
                            style={{ gridColumn: `${index * 2 + 1}` }}
                        >
                            <button
                                type="button"
                                className={`
                                    cp-progress-step-circle
                                    ${isCompleted ? 'completed' : ''}
                                    ${isActive ? 'active' : ''}
                                    ${isFuture ? 'future' : ''}
                                `}
                                onClick={() => {
                                    if (canGoBack) {
                                        onStepClick(stepNumber);
                                    }
                                }}
                                disabled={!canGoBack}
                                aria-label={`Ir al paso ${stepNumber}: ${step}`}
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
                                style={{ gridColumn: `${index * 2 + 2}` }}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}