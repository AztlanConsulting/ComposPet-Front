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
 * Calcula el lunes de la semana de recolección (Sábado-Viernes) a la que
 * pertenece una fecha dada. Replica el mismo criterio usado en el backend
 * (Route.getCollectionWeekMonday) para que el formulario y la tabla de
 * rutas agrupen las solicitudes de la misma forma y no se generen
 * solicitudes duplicadas cuando un cliente entra en sábado y otro en
 * domingo de la misma semana.
 *
 * @param {Date} date - Fecha a evaluar.
 * @returns {Date} Lunes (hora local, medianoche) de la semana de recolección correspondiente.
 */
function getCollectionWeekMonday(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dow = d.getDay();

    if (dow === 6) { // Sábado -> semana siguiente
        d.setDate(d.getDate() + 2);
        return d;
    }
    if (dow === 0) { // Domingo -> semana siguiente
        d.setDate(d.getDate() + 1);
        return d;
    }
    // Lunes a Viernes: retrocede al lunes de esa misma semana
    d.setDate(d.getDate() - (dow - 1));
    return d;
}

/**
 * Calcula el rango de la semana de recolección actual (Sábado 00:00 a
 * Viernes 23:59:59.999), usando el mismo criterio que la tabla de rutas.
 * Antes usaba una semana domingo-sábado independiente, lo que provocaba
 * que un cliente que entraba sábado y volvía domingo generara dos
 * solicitudes distintas para la misma semana de recolección.
 *
 * @returns {{ weekStartDate: string, weekEndDate: string }}
 */
function calculateCurrentWeekRange() {
    const today = new Date();
    const monday = getCollectionWeekMonday(today);

    const weekStartDate = new Date(monday);
    weekStartDate.setDate(weekStartDate.getDate() - 2); // Sábado de esa semana
    weekStartDate.setHours(0, 0, 0, 0);

    const weekEndDate = new Date(monday);
    weekEndDate.setDate(weekEndDate.getDate() + 4); // Viernes de esa semana
    weekEndDate.setHours(23, 59, 59, 999);

    return {
        weekStartDate: weekStartDate.toISOString(),
        weekEndDate: weekEndDate.toISOString(),
    };
}


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

/**
 * Determina el desplazamiento en días, respecto al lunes de la semana
 * de recolección (Sábado-Viernes), correspondiente a cada día de ruta.
 */
const ROUTE_DAY_OFFSET_FROM_MONDAY = {
    1: 0,  // Lunes
    2: 1,  // Martes
    3: 2,  // Miércoles
    4: 3,  // Jueves
    5: 4,  // Viernes
    6: -2, // Sábado
    0: -1, // Domingo
};

/**
 * Determina si el cliente está dentro del horario permitido para generar
 * una solicitud de recolección, considerando su día de ruta.
 *
 * La semana de recolección va de Sábado a Viernes (mismo criterio usado
 * en la tabla de rutas, vía getCollectionWeekMonday). El acceso se abre
 * al inicio de esa semana (Sábado 00:00) y se cierra un día antes del
 * día de ruta del cliente, a las 6:00 PM.
 *
 * @param {string} routeDay - Día de ruta del cliente (ej. "Lunes 1").
 * @returns {boolean} true si el cliente puede acceder al formulario ahora.
 */
function theClientIsInTime(routeDay) {
    const today = new Date();
    const routeDayNumber = getRouteDayNumber(routeDay);

    if (routeDayNumber === null) return false;

    const monday = getCollectionWeekMonday(today);

    const routeDate = new Date(monday);
    routeDate.setDate(routeDate.getDate() + ROUTE_DAY_OFFSET_FROM_MONDAY[routeDayNumber]);
    routeDate.setHours(0, 0, 0, 0);

    const limitDate = new Date(routeDate);
    limitDate.setDate(limitDate.getDate() - 1); // día anterior a la ruta
    limitDate.setHours(18, 0, 0, 0); // 6:00 PM

    const weekStartDate = new Date(monday);
    weekStartDate.setDate(weekStartDate.getDate() - 2); // Sábado de esa semana
    weekStartDate.setHours(0, 0, 0, 0);

    const access = today >= weekStartDate && today <= limitDate;

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