import { useState } from 'react';


import useSolicitudRecPrimeraSeccionViewModel from './firstFormViewModel';
import SecondPageForm from './secondPageViewModel';
//import useSolicitudRecTerceraSeccionViewModel from './thirdFormViewModel';
//import useSolicitudRecCuartaSeccionViewModel from './fourthFormViewModel';
//import useSolicitudRecQuintaSeccionViewModel from './fifthFormViewModel';


import useAuthenticatedClient from '../utils/useAuthenticatedClient';

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
    const totalSteps = 4;
    const [currentStep, setCurrentStep] = useState(1);
    
    const { idCliente } = useAuthenticatedClient();


    const { fechaInicioSemana, fechaFinSemana } = calcularRangoSemanaActual();

    const primeraSeccionVM = useSolicitudRecPrimeraSeccionViewModel(
        idCliente,
        fechaInicioSemana,
        fechaFinSemana,
    );

    const segundaSeccionVM = SecondPageForm(
        idCliente,
        currentStep === 2,
    );

    const regresarStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const cancelarFormulario = () => {
        console.log('Aquí irá la lógica de cancelar del step 1');
        // Aquí puedes agregar la lógica para cancelar el formulario, como limpiar estados y redirigir a Home 
        // Mandas a llamar a la función ya sea que la separes en utils o este en un viewmodel específico.
    };


    const onSecondaryAction = () => {
        if (currentStep === 1) {
            cancelarFormulario();
            return;
        }

        regresarStep();
    };

    const onPrimaryAction = async () => {
        if (currentStep === 1) {
            const result = await primeraSeccionVM.guardarPrimeraSeccion();

            if (result.success && result.nextStep) {
                setCurrentStep(result.nextStep);
            }
            return;
        }

        if (currentStep === 2) {
            const result = await segundaSeccionVM.guardarSegundaSeccion();

            if (result.success && result.nextStep) {
                setCurrentStep(result.nextStep);
            }
            return;
        }

        if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const secondaryButtonText = currentStep === 1 ? 'Cancelar' : 'Regresar';
    const primaryButtonText = currentStep === totalSteps ? 'Enviar' : 'Siguiente';



    return {
        currentStep,
        totalSteps,
        onPrimaryAction,
        onSecondaryAction,
        primaryButtonText,
        secondaryButtonText,
        primeraSeccionVM,
        segundaSeccionVM, // Reemplazar con segundaSeccionVM cuando esté implementada
    };
}

export default useSolicitudViewModel;