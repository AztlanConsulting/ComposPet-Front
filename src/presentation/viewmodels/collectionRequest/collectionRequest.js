import { useState } from 'react';


import useCollectionRequestFirstSectionViewModel from './firstFormViewModel';
//import useCollectionRequestSecondSectionViewModel from './secondFormViewModel';
//import useCollectionRequestThirdSectionViewModel from './thirdFormViewModel';
//import useCollectionRequestFourthSectionViewModel from './fourthFormViewModel';
//import useCollectionRequestFifthSectionViewModel from './fifthFormViewModel';


import useAuthenticatedClient from '../utils/useAuthenticatedClient';

/**
 * Calcula el rango de la semana actual 
 * Considera domingo como inicio de semana y sabado como fin.
 *
 * @returns {{ fechaInicioSemana: string, fechaFinSemana: string }}
 */
function calculateCurrentWeekRange() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Domingo) a 6 (Sábado)

    const weekStartDate = new Date(today);
    const weekEndDate = new Date(today);

    // Ajusta la fecha de inicio al domingo.
    weekStartDate.setDate(today.getDate() - dayOfWeek);
    weekStartDate.setHours(0, 0, 0, 0);

    // Ajusta la fecha de fin al sábado.
    weekEndDate.setDate(today.getDate() + (6 - dayOfWeek));
    weekEndDate.setHours(23, 59, 59, 999);
    
    return { 
        weekStartDate: weekStartDate.toISOString(),
        weekEndDate: weekEndDate.toISOString(),
    };
};  


/**
 * ViewModel padre de la vista completa del formulario de recolección.
 *
 * @returns {object} Estado general del formulario y acciones de navegación.
 */
function useCollectionRequestViewModel(){
    const totalSteps = 4;
    const [currentStep, setCurrentStep] = useState(1);
    
    // Llama al util useAuthenticatedClient y solo extrae clientId
    const { clientId } = useAuthenticatedClient();


    const { weekStartDate, weekEndDate } = calculateCurrentWeekRange();

    //Aqui se llama a el firsrtFormViewModel, recibe la info de la request
    const firstSectionViewModel = useCollectionRequestFirstSectionViewModel(
        clientId,
        weekStartDate,
        weekEndDate,
    );

    /* const secondSectionViewModel = useCollectionRequestSecondSectionViewModel(
        clientId,
        weekStartDate,
        weekEndDate,
    ); */

    const goBackStep= () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const cancelForm= () => {
        // Aquí puedes agregar la lógica para cancelar el formulario, como limpiar estados y redirigir a Home 
        // Mandas a llamar a la función ya sea que la separes en utils o este en un viewmodel específico.
    };


    const onSecondaryAction = () => {
        if (currentStep === 1) {
            cancelForm();
            return;
        }

        goBackStep();
    };

    const onPrimaryAction = async () => {
        if (currentStep === 1) {
            // Manda a llamar el metodo saveFirstSection CollectionRequestViewModel 
            const result = await firstSectionViewModel.saveFirstSection();

            //Resultado de guardar la solicitud
            if (result.success && result.nextStep) {
                
                //Ir al siguiente paso
                setCurrentStep(result.nextStep);
            }
            return;
        }

        if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1);
        }
        // Aquí después irá la lógica del step 2, 3, 4...
        /* if (currentStep === 2) {
            const result = await secondSectionViewModel.saveSecondSection();

            if (result.success && result.nextStep) {
                setCurrentStep(result.nextStep);
            }
            return;
        } */
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
        firstSectionViewModel,
        //secondSectionViewModel, // Reemplazar con secondSectionViewModel cuando esté implementada
    };
}

export default useCollectionRequestViewModel;