import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TimerAlert from "../../../components/Template/timerAlert";
import ProblemAlert from "../../../components/Template/ProblemAlert";

import { CollectionRequestApiClient } from '../../../data/datasources/collectionRequestApiClient';
import { CollectionRequestRepository } from '../../../data/repositories/collectionRequestRepository';

// Use cases
import { GetCurrentCollectionRequestUseCase } from '../../../domain/useCases/getCurrentCollectionRequestUseCase';
import { SaveCollectionRequestFirstSectionUseCase } from '../../../domain/useCases/saveCollectionRequestFirstSectionUseCase';


const MIN_BUCKETS_LIMIT = 0;
const MAX_BUCKETS_LIMIT = 20;

/**
 * Valida los campos de la primera sección del formulario de recolección.
 *
 * Validaciones aplicadas:
 * - Debe existir un id de solicitud.
 * - Si desea recolección, la cantidad de cubetas recolectadas no puede ser negativa.
 * - La cantidad de cubetas entregadas no puede ser negativa.
 *
 * @param {object} params - Datos del formulario.
 * @param {string} params.idSolicitud - Id de la solicitud actual.
 * @param {boolean} params.quiereRecoleccion - Indica si el cliente desea recolección.
 * @param {boolean} params.quiereProductosExtra - Indica si el cliente desea productos extra.
 * @param {number} params.cubetasRecolectadas - Cantidad de cubetas vacías solicitadas.
 * @param {number} params.cubetasEntregadas - Cantidad de cubetas que el cliente entregará.
 * @returns {{ errors: { general: string, cubetasRecolectadas: string, cubetasEntregadas: string }, hasErrors: boolean }}
 * Objeto con mensajes de error e indicador de si hay errores.
 */

function validateCollectionRequestFirstSection({
    requestId,
    wantsCollection,
    wantsExtraProducts,
    collectedBuckets,
    deliveredBuckets,
}){
    //Objeto donde se almacenarán los mensajes de error para cada campo
    const errors = {
        requestId: '',
        wantsCollection: '',
        wantsExtraProducts: '',
        collectedBuckets: '',
        deliveredBuckets: '',
        general: '',
    };

    let hasErrors = false;

    //Validación del Id
    if (!requestId) {
        errors.requestId = 'Id de solicitud no encontrado. Por favor regresa a la pantalla anterior.';
        hasErrors = true;
    }

    if (wantsCollection === undefined || wantsCollection === null) {
        errors.wantsCollection = 'Indica si deseas recolección.';
        hasErrors = true;
    }

    if (wantsExtraProducts === undefined || wantsExtraProducts === null) {
        errors.wantsExtraProducts = 'Indica si deseas productos extra.';
        hasErrors = true;
    }

    // Si el desea recolección, la cantidad de cubetas no pueden ser 0 al mismo tiempo.
    if (wantsCollection && (collectedBuckets <= 0 && deliveredBuckets <= 0)) {
        errors.collectedBuckets = 'Las dos cantidades no pueden ser 0.';
        errors.deliveredBuckets = 'Las dos cantidades no pueden ser 0.';
        hasErrors = true;
    }

    // Si el cliente desea recolección, la cantidad de cubetas recolectadas debe ser menor a 20.
    if (wantsCollection && (collectedBuckets >20)) {
        errors.collectedBuckets = 'La cantidad de las cubetas no pueden ser mayor a 20.'; 
        hasErrors =true
    }

    // Si el cliente desea recolección, la cantidad de cubetas entregadas debe ser manor a 20.
    if (wantsCollection && (deliveredBuckets >20)) {
        errors.deliveredBuckets = 'La cantidad de las cubetas no pueden ser mayor a 20.'; 
        hasErrors =true
    }


    //Si el cliente no desea recolección ni productos extra, la cantidad de cubetas entregadas debe ser 0
    if (wantsCollection === false  &&collectedBuckets === 0 && deliveredBuckets !== 0) {
        errors.deliveredBuckets = 'La cantidad debe ser 0.';
        hasErrors = true;
    }

    //Si el cliente no desea recolección ni productos extra, la cantidad de cubetas recolectadas debe ser 0
    if (wantsCollection === false  &&collectedBuckets !== 0 && deliveredBuckets === 0) {
        errors.collectedBuckets = 'La cantidad debe ser 0.';
        hasErrors = true;
    }

    //Si el cliente no desea recolección ni productos extra, la cantidad de cubetas recolectadas debe ser 0
    if (wantsCollection === false &&collectedBuckets !== 0 && deliveredBuckets !== 0) {
        errors.collectedBuckets = 'La cantidad debe ser 0.';
        errors.deliveredBuckets = 'La cantidad debe ser 0.';
        hasErrors = true;
    }

    //Regresa el resultado de la validación
    return { errors, hasErrors };
}

/**
 * ViewModel de la primera sección del formulario de recolección (FORM-02).
 * Gestiona el estado del formulario, ejecuta las validaciones locales
 * y maneja la lógica de carga, validación y guardado de la primera sección.
 *
 * @param {string} clientId - Id del cliente autenticado en formato UUID.
 * @param {string} weekStartDate - Fecha inicial del rango semanal.
 * @param {string} weekEndDate - Fecha final del rango semanal.
 * @returns {Object} Estado y acciones del step 1.
 */
function useCollectionRequestFirstSectionViewModel(clientId, weekStartDate, weekEndDate) {

    const navigate = useNavigate();

    //Estados iniciales del formulario para valores controlados de las moleculas
    const [requestId, setRequestId] = useState('');
    const [wantsCollection, setWantsCollection] = useState(null);
    const [wantsExtraProducts, setWantsExtraProducts] = useState(null);
    const [collectedBuckets, setCollectedBuckets] = useState(0);
    const [deliveredBuckets, setDeliveredBuckets] = useState(0);
    const [status, setStatus] = useState(false);

    //Estado inicial de los errores
    //Puede que no sea necesario, por que nunca tendria error inicial
    const [errors, setErrors] = useState({
        requestId: '',
        wantsCollection: '',
        wantsExtraProducts: '',
        collectedBuckets: '',
        deliveredBuckets: '',
        general: '',
    });

    //Saber si se está cargando la solicitud actual o guardando los datos, para mostrar en la UI
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState(null);
    

    //Empiezan los efectos

    //Carga la solicitud de recolección actual del cliente al montar el componente
    const loadCurrentCollectionRequest = async () => {
        if (!clientId || !weekStartDate || !weekEndDate) return;
        setLoading(true);

        setLoadError(null);

        // Limpiar errores
        setErrors({
            requestId: '',
            wantsCollection: '',
            wantsExtraProducts: '',
            collectedBuckets: '',
            deliveredBuckets: '',
            general: '',
        });

        try {
            const apiClient = new CollectionRequestApiClient();
            const collectionRequestRepository = new CollectionRequestRepository(apiClient);
            const getCurrentCollectionRequestUseCase = new GetCurrentCollectionRequestUseCase(
                collectionRequestRepository,
            );

            const collectionRequest = await getCurrentCollectionRequestUseCase.execute(
                clientId,
                weekStartDate,
                weekEndDate,
            );

            setRequestId(collectionRequest.id);
            setWantsCollection(collectionRequest.wantsPickup());
            setWantsExtraProducts(collectionRequest.wantsAdditionalProducts());
            setCollectedBuckets(collectionRequest.collectedBuckets || 0);
            setDeliveredBuckets(collectionRequest.deliveredBuckets || 0);
            setStatus(collectionRequest.getStatus());

            //Aqui obtengo el status para ver si saco de una al cliente

        } catch (error) {
            console.error("Error al cargar la solicitud actual:", error);

            setLoadError(
            "No pudimos cargar la información de tu solicitud. Intenta nuevamente más tarde."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCurrentCollectionRequest();
    }, [clientId, weekStartDate, weekEndDate]);

    useEffect(() => {

        const validateCompletedRequest = async () => {

            if (status !== true) return;

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
        };

        validateCompletedRequest();

    }, [status, navigate]);

    // Efectos ajustar a 0 las cubetas recolectadas y entregadas si el cliente no quiere recolección.
    useEffect(() => {
        if (wantsCollection === false) {
            setCollectedBuckets(0);
            setDeliveredBuckets(0);
        }
    }, [wantsCollection, wantsExtraProducts]);

    // Limpia el error de recolección cuando ya existe una respuesta válida
    useEffect(() => {
        if (wantsCollection !== undefined && wantsCollection !== null) {
            setErrors((previousErrors) => ({
                ...previousErrors,
                wantsCollection: '',
            }));
        }
    }, [wantsCollection]);

    // Limpia el error de productos extra cuando ya existe una respuesta válida
    useEffect(() => {
        if (wantsExtraProducts !== undefined && wantsExtraProducts !== null) {
            setErrors((previousErrors) => ({
                ...previousErrors,
                wantsExtraProducts: '',
            }));
        }
    }, [wantsExtraProducts]);

    // Limpia el error de cubetas a entregar cuando el valor ya es válido
    useEffect(() => {
        const collectedBucketsIsValid =
            (wantsCollection === true && collectedBuckets > 0) ||
            (wantsCollection === false && collectedBuckets === 0);

        if (collectedBucketsIsValid) {
            setErrors((previousErrors) => ({
                ...previousErrors,
                collectedBuckets: '',
            }));
        }
    }, [wantsCollection, collectedBuckets]);

    // Limpia el error de las dos cubetas cuando el valor ya es válido
    useEffect(() => {
        const deliveredBucketsIsValid =
            (wantsCollection === true && ((deliveredBuckets > 0) || (collectedBuckets > 0) )) ||
            (wantsCollection === false && deliveredBuckets === 0);

        if (deliveredBucketsIsValid) {
            setErrors((previousErrors) => ({
                ...previousErrors,
                deliveredBuckets: '',
                collectedBuckets: '',
            }));
        }
    }, [wantsCollection, collectedBuckets, deliveredBuckets]);

    const clampBucketValue = (value) => {
        if (value === '') {
            return '';
        }

        const numericValue = Number(value);

        if (Number.isNaN(numericValue)) {
            return MIN_BUCKETS_LIMIT;
        }

        return Math.min(
            Math.max(numericValue, MIN_BUCKETS_LIMIT),
            MAX_BUCKETS_LIMIT,
        );
    };

    const handleDeliveredBucketsChange = (newValue) => {
        setDeliveredBuckets(clampBucketValue(newValue));
    };

    const handleCollectedBucketsChange = (newValue) => {
        setCollectedBuckets(clampBucketValue(newValue));
    };


    const incrementDeliveredBuckets = () => {
        setDeliveredBuckets((previousValue) => {
            const currentValue = previousValue === '' ? MIN_BUCKETS_LIMIT : Number(previousValue);
            return clampBucketValue(currentValue + 1);
        });
    };

    const decrementDeliveredBuckets = () => {
        setDeliveredBuckets((previousValue) => {
            const currentValue = previousValue === '' ? MIN_BUCKETS_LIMIT : Number(previousValue);
            return clampBucketValue(currentValue - 1);
        });
    };

    const incrementCollectedBuckets = () => {
        setCollectedBuckets((previousValue) => {
            const currentValue = previousValue === '' ? MIN_BUCKETS_LIMIT : Number(previousValue);
            return clampBucketValue(currentValue + 1);
        });
    };

    const decrementCollectedBuckets = () => {
        setCollectedBuckets((previousValue) => {
            const currentValue = previousValue === '' ? MIN_BUCKETS_LIMIT : Number(previousValue);
            return clampBucketValue(currentValue - 1);
        });
    };

    /**
     * Valida y guarda la primera sección del formulario.
     * Retorna al ViewModel padre el siguiente step sugerido.
     *
     * @returns {Promise<{success: boolean, nextStep?: number}>} Resultado del guardado.
     */

    const saveFirstSection = async () => {
        // Se valida primero la información a guardar
        const { errors: validationErrors, hasErrors } = validateCollectionRequestFirstSection({
            requestId,
            wantsCollection,
            wantsExtraProducts,
            collectedBuckets,
            deliveredBuckets,
        });

        if (hasErrors) {
            setErrors(validationErrors);
            return { success: false };
        }

        setErrors({
            requestId: '',
            wantsCollection: '',
            wantsExtraProducts: '',
            collectedBuckets: '',
            deliveredBuckets: '',
            general: '',
        });

        setLoading(true);

        try {
            const apiClient = new CollectionRequestApiClient();
            const collectionRequestRepository = new CollectionRequestRepository(apiClient);
            const saveCollectionRequestFirstSectionUseCase = new SaveCollectionRequestFirstSectionUseCase(
                collectionRequestRepository,
            );

            //Llama al UseCase para guardar la solicitud del cliente
            const collectionRequest = await saveCollectionRequestFirstSectionUseCase.execute(
                requestId,
                wantsCollection,
                wantsExtraProducts,
                Number(collectedBuckets || 0),
                Number(deliveredBuckets || 0),
            );

            let nextStep = 2; // Si el cliente desea productos extra, va al step 2 

            // Si el cliente no desea productos extra, pero sí recolección, va al step 3
            if (!collectionRequest.wantsAdditionalProducts() && collectionRequest.wantsPickup()) {
                nextStep = 3;

            // Si el cliente no desea recolección ni productos extra va directo al resumen sin agendar
            }else if (!collectionRequest.wantsPickup() && !collectionRequest.wantsAdditionalProducts()) {
                nextStep = 3; 
            }
            
            return { 
                success: true, 
                nextStep,
            };
        } catch (error) {

            console.error("Error al guardar la primera sección:", error);
            await ProblemAlert({
                title: "No pudimos guardar la información",
                text: "Ocurrió un problema al guardar tu solicitud. Intenta nuevamente.",
                icon: "error",
                confirmText: "Entendido",
            });

            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return {
        requestId,
        wantsCollection,
        wantsExtraProducts,
        collectedBuckets,
        deliveredBuckets,
        errors,
        loading,
        loadError,

        setWantsCollection,
        setWantsExtraProducts,

        handleDeliveredBucketsChange,
        handleCollectedBucketsChange,
        incrementDeliveredBuckets,
        decrementDeliveredBuckets,
        incrementCollectedBuckets,
        decrementCollectedBuckets,

        

        saveFirstSection,
        loadCurrentCollectionRequest,
    };
}

export default useCollectionRequestFirstSectionViewModel;