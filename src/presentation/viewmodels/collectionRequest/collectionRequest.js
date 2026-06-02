import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import useCollectionRequestFirstSectionViewModel from './firstFormViewModel';
import useCollectionRequestThirdSectionViewModel from './thirdFormViewModel';


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
    limitDate.setHours(limitDate.getHours() - 1);

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
    const progressSteps = ['Recolección', 'Productos', 'Carrito'];
    const totalSteps = progressSteps.length;

    const [currentStep, setCurrentStep] = useState(1);
    const [debtAccess, setDebtAccess] = useState(false)
    const [accessValidated, setAccessValidated] = useState(false);

    const accessValidationStartedRef = useRef(false);
    const debtAlertShownRef = useRef(false);
    const completedAlertShownRef = useRef(false);
    const outOfTimeAlertShownRef = useRef(false);
    const blockedDebtAlertShownRef = useRef(false);

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


    useEffect(() => {
        const validateFormAccess = async () => {
        
        if (
            balance === null ||
            balance === undefined ||
            !routeDay ||
            firstSectionViewModel.loading ||
            firstSectionViewModel.status === null
        ) {
            return;
        }

        if (accessValidated || accessValidationStartedRef.current) {
            return;
        }

        accessValidationStartedRef.current = true;

        const requestIsCompleted = firstSectionViewModel.status === true;


        if (requestIsCompleted) {
            const result = await TimerAlert({
                title: "Solicitud ya completada",
                text: "Ya completaste tu solicitud de recolección de esta semana.",
                secondaryText: "Si deseas hacer una modificación urgente, contáctanos a través de WhatsApp.",
                confirmText: "Continuar",
                timer: 10000,
            });

            if (result.isConfirmed || result.dismiss) {
                navigate("/");
            }

            return;
        }

        const isInTimeToRequest = theClientIsInTime(routeDay);


        if (!isInTimeToRequest) {
            const result = await TimerAlert({
                title: "Solicitud no disponible",
                text: "Ya no te encuentras dentro del horario permitido para generar una solicitud, antes de tu día de recolecta.",
                secondaryText: "Si es una urgencia, contáctanos a través de WhatsApp.",
                confirmText: "Continuar",
                timer: 10000,
            });

            if (result.isConfirmed || result.dismiss) {
                navigate("/");
            }

            return;
        }

        
        if (balance > -500){
            setDebtAccess(true);
            setAccessValidated(true);
            return;
        }

        if (balance <= -500 && balance > -1500){
            const result = await TimerAlert({
                title: "Adeudo Pendiente",
                text: "Tienes un adeudo mayor a $500, te recordamos pagarlo lo antes posible." ,
                secondaryText: "",
                confirmText: "Continuar",
                timer:10000,
            });

            if (result.isConfirmed || result.dismiss){
                setDebtAccess(true);
                setAccessValidated(true);
            }

            return;
        }
        if (balance <= -1500){
            const result = await TimerAlert({
                title: "Solicitud no disponible",
                text: "Tienes un adeudo mayor a $1500, por lo que no es posible generar una solicitud." ,
                secondaryText: "",
                confirmText: "Continuar",
                timer:10000,
            });

            if (result.isConfirmed || result.dismiss) {
                navigate("/");
            }
        }
    };

    validateFormAccess();
    }, [
        balance,
        routeDay,
        firstSectionViewModel.status,
        firstSectionViewModel.loading,
        navigate,
    ]);
    
    
    /**
     * Regresa al formulario a un paso anterior desde la barra de progreso.
     *
     * Solo permite ir hacia atrás, evitando avanzar
     * desde la barra. Antes de cambiar de paso, recarga la
     * información correspondiente para mantener actualizados los datos
     *
     * @param {number} targetStep - Número del paso al que se desea regresar.
     * @returns {Promise<void>} No retorna ningún valor.
     */

    const goToPreviousStep = async (targetStep) => {
        if (targetStep >= currentStep) return;

        if (targetStep < 1 || targetStep > totalSteps) return;

        if (currentStep === 2 && targetStep === 1) {
            await firstSectionViewModel.loadCurrentCollectionRequest();
        }

        if (currentStep === 3) {
            if (targetStep === 2) {
                await secondSectionViewModel.loadData();
            }

            if (targetStep === 1) {
                await firstSectionViewModel.loadCurrentCollectionRequest();
            }
        }

        setCurrentStep(targetStep);
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

    const onSecondaryAction = async () => {
        if (currentStep === 1) {
            await cancelForm();
            return;
        }

        await goToPreviousStep(currentStep - 1);
    };

    const onPrimaryAction = async () => {

        if (!accessValidated) return;

        if (loading || firstSectionViewModel.loading) return;

        if (firstSectionViewModel.status === true) {

            if (completedAlertShownRef.current) return;

            completedAlertShownRef.current = true;

            const result = await TimerAlert({
                title: "Solicitud ya completada",
                text: "Ya completaste tu solicitud de recolección de esta semana.",
                secondaryText: "Si deseas hacer una modificación urgente, contáctanos a través de WhatsApp.",
                confirmText: "Continuar",
                timer: 10000,
            });

            if (result.isConfirmed || result.dismiss) {
                navigate("/");
            }

            return;
        }

        if (currentStep === 1) {
            const result = await firstSectionViewModel.saveFirstSection();

            if (result.success && result.nextStep) {
                if (result.nextStep === 2) {
                    await secondSectionViewModel.loadData();
                }

                if (result.nextStep === 3) {
                    await thirdSectionViewModel.loadSummary();
                }

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
            const result = await ConfirmAlert({
                title: "¿Estás seguro que deseas enviar tu solicitud?",
                text: "Una vez enviada, no podrás hacer cambios en tu solicitud.",
                confirmText: "Sí, enviar solicitud",
                cancelText: "No, quedarme aquí",
            });

            if (!result.isConfirmed) return;

            const saveResult = await thirdSectionViewModel.saveThirdSection();

            if (saveResult.success && saveResult.nextStep) {
                navigate("/");
            }
        }

    };

    const secondaryButtonText = currentStep === 1 ? 'Cancelar' : 'Regresar';
    const primaryButtonText = currentStep === totalSteps ? 'Enviar' : 'Siguiente';

    return {
        currentStep,
        progressSteps,
        onPrimaryAction,
        onSecondaryAction,
        cancelForm,
        goToPreviousStep,
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