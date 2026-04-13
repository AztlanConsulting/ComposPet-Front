import { useState } from 'react';


import useSolicitudRecPrimeraSeccionViewModel from './firstFormViewModel';
import useAuthenticatedClient from '../share/useAuthenticatedClient';

/**
 * Calcula el rango de la semana actual 
 * Considera domingo como inicio de semana y sabado como fin.
 *
 * @returns {{ fechaInicioSemana: string, fechaFinSemana: string }}
 */
function calcularRangoSemanaActual() {
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0 (Domingo) a 6 (Sábado)
    console.log('Día de la semana (0-6, Domingo-Sábado):', diaSemana);

    const fechaInicioSemana = new Date(hoy);
    const fechaFinSemana = new Date(hoy);

    // Ajustar la fecha de inicio a domingo
    fechaInicioSemana.setDate(hoy.getDate() - diaSemana);
    fechaInicioSemana.setHours(0, 0, 0, 0);
    console.log('Fecha de inicio de semana domingo:', fechaInicioSemana);

    // Ajustar la fecha de fin a sábado
    fechaFinSemana.setDate(hoy.getDate() + (6 - diaSemana));
    fechaFinSemana.setHours(23, 59, 59, 999);
    console.log('Fecha de fin de semana sábado:', fechaFinSemana);

    return { 
        fechaInicioSemana: fechaInicioSemana.toISOString(),
        fechaFinSemana: fechaFinSemana.toISOString(),
    };
};  


/**
 * ViewModel padre de la vista completa del formulario de recolección.
 *
 * @returns {object} Estado general del formulario y acciones de navegación.
 */
function useSolicitudViewModel() {
    const totalSteps = 5;
    const [currentStep, setCurrentStep] = useState(1);
    
    const { idCliente } = useAuthenticatedClient();


    const { fechaInicioSemana, fechaFinSemana } = calcularRangoSemanaActual();

    const primeraSeccionVM = useSolicitudRecPrimeraSeccionViewModel(
        idCliente,
        fechaInicioSemana,
        fechaFinSemana,
    );

    const onBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const onNext = async () => {
        if (currentStep === 1) {
            const result = await primeraSeccionVM.guardarPrimeraSeccion();

            if (result.success && result.nextStep) {
                setCurrentStep(result.nextStep);
            }
            
        }


    };

    return {
        currentStep,
        totalSteps,
        onNext,
        onBack,
        primeraSeccionVM,
    };
}

export default useSolicitudViewModel;