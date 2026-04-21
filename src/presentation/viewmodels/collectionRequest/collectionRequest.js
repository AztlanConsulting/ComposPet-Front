import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import useCollectionRequestFirstSectionViewModel from './firstFormViewModel';
import useSecondPageViewModel from './secondPageViewModel';
import ConfirmAlert from "../../../components/Template/confirmationAlert";
import TimerAlert from '../../../components/Template/timerAlert';


import useAuthenticatedClient from '../utils/useAuthenticatedClient';
import useCardBalance from '../utils/useCardBalance';

/**
 * Calcula el rango de la semana actual 
 * Considera domingo como inicio de semana y sábado como fin.
 *
 * @returns {{ weekStartDate: string, weekEndDate: string }}
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
function useCollectionRequestViewModel() {
    const totalSteps = 4;
    const [currentStep, setCurrentStep] = useState(1);
    const [debtAccess, setDebtAccess] = useState(false)

    const navigate = useNavigate();
    
    const { clientId } = useAuthenticatedClient();
    const { balance } = useCardBalance(clientId);

    useEffect(() => {
        const validateDebtAccess = async () => {

        if (balance === null || balance === undefined) return;
        
        if (balance > -500){
            setDebtAccess(true);
            return;
        }

        if (balance <= -500 && balance > -1500){
            const result = await TimerAlert({
                title: "Adeudo Pendiente",
                text: "Tienes un adeudo mayor a $500, te recordamos pagarlo lo antes posible." ,
                confirmText: "Continuar",
                timer:10000,
            });

            if (result.isConfirmed || result.dismiss){
                setDebtAccess(true);
            }

            return;
        }
        if (balance <= -1500){
            const result = await TimerAlert({
                title: "Solicitud no disponible",
                text: "Tienes un adeudo mayor a $1500, por lo que no es posible generar una solicitud." ,
                confirmText: "Continuar",
                timer:10000,
            });

            if (result.isConfirmed || result.dismiss) {
                navigate("/");
            }
        }
    };

    validateDebtAccess();
    }, [balance, navigate]);
    
    const { weekStartDate, weekEndDate } = calculateCurrentWeekRange();

    //Aqui se llama a el firsrtFormViewModel, recibe la info de la request
    const firstSectionViewModel = useCollectionRequestFirstSectionViewModel(
        clientId,
        weekStartDate,
        weekEndDate,
    );

    console.log("CLIENTE ID", clientId)
    const secondSectionViewModel = useSecondPageViewModel(clientId);

    const goBackStep = () => {
        
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const cancelForm = async () => {
        const result = await ConfirmAlert({
            title: "¿Estas seguro que deseas salir del formulario?",
            text: "Se perderán los cambios no guardados.",
            confirmText: "Sí, cancelar",
            cancelText: "Seguir editando",
        });

        if (result.isConfirmed) {
            navigate("/");
        }
    };

    const onSecondaryAction = () => {
        if (currentStep === 1) {
            cancelForm();
            return;
        }

        if (currentStep === 2){
            firstSectionViewModel.loadCurrentCollectionRequest();
        }

        if (currentStep === 3){
            secondSectionViewModel.loadData();
        }

        goBackStep();
    };

    const onPrimaryAction = async () => {
        //if(debtAccess) return;

        if (currentStep === 1) {
            console.log("ENtro al step 1")
            // Manda a llamar el metodo saveFirstSection CollectionRequestViewModel 
            const result = await firstSectionViewModel.saveFirstSection();

            //Resultado de guardar la solicitud
            if (result.success && result.nextStep) {
                
                //Ir al siguiente paso
                setCurrentStep(result.nextStep);
            }
            return;
        }

        if (currentStep === 2) {
            // console.log("ENtro al step 2    ")
            const products = secondSectionViewModel.selectedProducts || {};
            const isEmpty = Object.keys(products).length === 0;

            if (isEmpty) {
                const result = await ConfirmAlert({
                    title: "¿Continuar sin productos?",
                    text: "No has seleccionado algún productos. ¿Deseas continuar?",
                    confirmText: "Sí, continuar",
                    cancelText: "Seleccionar productos",
                });

                if (!result.isConfirmed) return;
            }

            const result = await secondSectionViewModel.saveSecondSection();

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
        cancelForm,
        primaryButtonText,
        secondaryButtonText,
        firstSectionViewModel,
        secondSectionViewModel,
        debtAccess,
        balance,
    };
}

export default useCollectionRequestViewModel;