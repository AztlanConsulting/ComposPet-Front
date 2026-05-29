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
    totalSteps,
    onStepClick,
}) {
    const steps = ['Recolección', 'Productos', 'Carrito'];

    const safeTotalSteps = steps.length || totalSteps || 1;
    const safeCurrentStep = Math.min(Math.max(currentStep, 1), safeTotalSteps);

    return (
        <section className="progress-section">
            <ProgressBar
                currentStep={safeCurrentStep}
                steps={steps}
                onStepClick={onStepClick}
            />
        </section>
    );
}