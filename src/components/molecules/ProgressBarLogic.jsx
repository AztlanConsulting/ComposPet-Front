import React from 'react';
import ProgressBar from '../atoms/ProgressBar';

import '../../css/molecules/progressBarLogic.css';

/**
 * Molécula para mostrar el avance del formulario.
 *
 * @param {number} currentStep - Paso actual del formulario.
 * @param {number} totalSteps - Total de pasos del formulario.
 * @param {Function} onStepClick - Función para regresar a un paso anterior.
 * @returns {JSX.Element} Sección de progreso del formulario.
 */
export default function ProgressBarLogic({
    currentStep,
    steps = [],
    onStepClick,
}) {
    const safeSteps = steps.length ? steps : ['Paso 1'];
    const safeTotalSteps = safeSteps.length;
    const safeCurrentStep = Math.min(Math.max(currentStep, 1), safeTotalSteps);

    return (
        <section className="progress-section">
            <ProgressBar
                currentStep={safeCurrentStep}
                steps={safeSteps}
                onStepClick={onStepClick}
            />
        </section>
    );
}
