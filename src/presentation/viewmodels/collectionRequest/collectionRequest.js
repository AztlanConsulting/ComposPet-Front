import { useState, useEffect } from 'react';
import { redirect, useNavigate } from "react-router-dom";
import useCollectionRequestFirstSectionViewModel from './firstFormViewModel';
//import useCollectionRequestSecondSectionViewModel from './secondFormViewModel';
import useCollectionRequestThirdSectionViewModel from './thirdFormViewModel';
//import useCollectionRequestFourthSectionViewModel from './fourthFormViewModel';
//import useCollectionRequestFifthSectionViewModel from './fifthFormViewModel';

import useSecondPageViewModel from './secondPageViewModel';
import ConfirmAlert from "../../../components/Template/confirmationAlert";
import TimerAlert from '../../../components/Template/timerAlert';


import useAuthenticatedClient from '../utils/useAuthenticatedClient';
import useCreditBalance from '../utils/useCreditBalance';

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


function StandardRouteDay(routeDay) {
    if (!routeDay) return null;


    let day = routeDay
        .split(" ")[0]
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    return day
}

function getRouteDayNumber(routeDay) {
    const standardDay = StandardRouteDay(routeDay);

    const routeDayNumber = {
        domingo: 0,
        lunes: 1,
        martes: 2,
        miercoles: 3,
        jueves: 4,
        viernes: 5,
        sabado: 6,
    };

    return routeDayNumber[standardDay] ?? null;
}

function theClientIsInTime(routeDay) {
    const today = new Date();
    const routeDayNumber = getRouteDayNumber(routeDay);

    if (routeDayNumber === null) return false;

    const currentDay = today.getDay();

    const routeDate = new Date(today);
    routeDate.setDate(today.getDate() + (routeDayNumber - currentDay));
    routeDate.setHours(0, 0, 0, 0);

    const limitDate = new Date(routeDate);
    limitDate.setHours(limitDate.getHours() - 6);

    const weekStartDate = new Date(today);
    weekStartDate.setDate(today.getDate() - currentDay);
    weekStartDate.setHours(0, 0, 0, 0);

    const access = today >= weekStartDate && today <= limitDate

    return access;
}

/**
 * ViewModel padre de la vista completa del formulario de recolección.
 *
 * @returns {object} Estado general del formulario y acciones de navegación.
 */
function useCollectionRequestViewModel() {
    const totalSteps = 3;
    const [currentStep, setCurrentStep] = useState(1);
    const [debtAccess, setDebtAccess] = useState(false)

    const navigate = useNavigate();
    
    const { clientId, 
            routeDay,  
            loading: clientloading, 
            error: clientError 
        } = useAuthenticatedClient();
    
    const { balance, 
            loading : creditLoading, 
            error: creditError 
        } = useCreditBalance(clientId);

    const loading = clientloading || creditLoading;
    const error = clientError || creditError;

    useEffect(() => {
        const validateFormAccess = async () => {

        if (balance === null || balance === undefined || !routeDay) return;

        const isInTimeToRequest = theClientIsInTime(routeDay);

        if (isInTimeToRequest === false){
            const result = await TimerAlert({
                title: "Solicitud no disponible",
                text: "Ya no te encuentras dentro del horario permitido para generar una solicitud, antes de tu día de recolecta." ,
                confirmText: "Continuar",
                timer:10000,
            });

            if (result.isConfirmed || result.dismiss) {
                navigate("/");
            }

            return;
        }
        
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

    validateFormAccess();
    }, [balance, navigate]);
    
    const { weekStartDate, weekEndDate } = calculateCurrentWeekRange();

    //Aqui se llama a el firsrtFormViewModel, recibe la info de la request
    const firstSectionViewModel = useCollectionRequestFirstSectionViewModel(
        clientId,
        weekStartDate,
        weekEndDate,
    );

    const secondSectionViewModel = useSecondPageViewModel(clientId);

    const thirdSectionViewModel = useCollectionRequestThirdSectionViewModel(
        clientId,
        weekStartDate,
        weekEndDate,
    );

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
            // Manda a llamar el metodo saveFirstSection CollectionRequestViewModel 
            const result = await firstSectionViewModel.saveFirstSection();

            //Resultado de guardar la solicitud
            if (result.success && result.nextStep) {
                thirdSectionViewModel.loadSummary();
                //Ir al siguiente paso
                setCurrentStep(result.nextStep);
            }
            return;
        }

        if (currentStep === 2) {
            const products = secondSectionViewModel.selectedProducts || {};
            const isEmpty = Object.keys(products).length === 0;

            if (isEmpty) {
                const result = await ConfirmAlert({
                    title: "¿Continuar sin productos?",
                    text: "No has seleccionado ningún producto. ¿Deseas continuar?",
                    confirmText: "Sí, continuar",
                    cancelText: "Seleccionar productos",
                });

                if (!result.isConfirmed) return;
            }

            const result = await secondSectionViewModel.saveSecondSection();

            if (result.success && result.nextStep) {
                thirdSectionViewModel.loadSummary();
                setCurrentStep(result.nextStep);
            }

            return;
        }

        if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1);
        }

        if (currentStep === 3) {
            const result = await thirdSectionViewModel.saveThirdSection();
            if (result.success && result.nextStep) {
                const result = await TimerAlert({
                    title: "¡Completaste tu registro de recolección!",
                    text: "" ,
                    confirmText: "Continuar",
                    icon: "success",
                    timer:10000,
                });
                navigate("/")
            }
            return;

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
        thirdSectionViewModel,
        secondSectionViewModel,
        debtAccess,
        balance,
        loading,
        error,
    };
}

export default useCollectionRequestViewModel;