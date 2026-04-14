import { useEffect, useState } from "react";

import { CollectionRequestApiClient } from '../../../data/datasources/collectionRequestApiClient';
import { CollectionRequestRepository } from '../../../data/repositories/collectionRequestRepository';

// Use cases
import { GetCurrentCollectionRequestUseCase } from '../../../domain/useCases/getCurrentCollectionRequestUseCase';
import { SaveCollectionRequestFirstSectionUseCase } from '../../../domain/useCases/saveCollectionRequestFirstSectionUseCase';


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

    // Si el cliente desea recolección, la cantidad de cubetas recolectadas debe ser mayor a 0.
    if (wantsCollection && collectedBuckets <= 0) {
        errors.collectedBuckets = 'La cantidad de cubetas que vas a entregar no puede ser igual o menor a 0.';
        hasErrors = true;
    }

    //Si el cliente no desea recolección, la cantidad de cubetas recolectadas debe ser 0
    if (wantsCollection === false && collectedBuckets !== 0) {
        errors.collectedBuckets = 'Si no deseas recolección, la cantidad de cubetas que vas a entregar debe ser 0.';
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
    console.log('Initializing step 1 ViewModel with:', {
        clientId,
        weekStartDate,
        weekEndDate,
    });


    //Estados iniciales del formulario para valores controlados de las moleculas
    const [requestId, setRequestId] = useState('');
    const [wantsCollection, setWantsCollection] = useState(null);
    const [wantsExtraProducts, setWantsExtraProducts] = useState(null);
    const [collectedBuckets, setCollectedBuckets] = useState(0);
    const [deliveredBuckets, setDeliveredBuckets] = useState(0);

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

    //Carga la solicitud de recolección actual del cliente al montar el componente
    useEffect(() => {
        
        console.log('Entró al useEffect de cargar solicitud');

        const loadCurrentCollectionRequest = async () => {

            console.log('No pasó el if, faltan parámetros');

            setLoading(true);

            //Limpiar errores antes de cargar
            setErrors({
                requestId: '',
                wantsCollection: '',
                wantsExtraProducts: '',
                collectedBuckets: '',
                deliveredBuckets: '',
                general: '',
            });

            try {
                //Construye capa de dominio para obtener la solicitud de recolección actual
                const apiClient = new CollectionRequestApiClient();
                const collectionRequestRepository = new CollectionRequestRepository(apiClient);
                const getCurrentCollectionRequestUseCase = new GetCurrentCollectionRequestUseCase(
                    collectionRequestRepository,
                );

                console.log('Executing GetCurrentCollectionRequestUseCase with:', {
                    clientId,
                    weekStartDate,
                    weekEndDate,
                });

                // Ejecuta el caso de uso para obtener la solicitud de recolección actual del cliente.
                const collectionRequest = await getCurrentCollectionRequestUseCase.execute(
                    clientId,
                    weekStartDate,
                    weekEndDate,
                );


                console.log('Respuesta del caso de uso:', collectionRequest);

                // Guarda los datos para mostrarlos. Si existe la solicitud actual, la usa; en caso contrario se mantienen los valores iniciales.
                setRequestId(collectionRequest.id);
                setWantsCollection(collectionRequest.wantsPickup());
                setWantsExtraProducts(collectionRequest.wantsAdditionalProducts());
                setCollectedBuckets(collectionRequest.collectedBuckets || 0);
                setDeliveredBuckets(collectionRequest.deliveredBuckets || 0);
            
            //Manejo de errores de la solicitud de recolección actual
            } catch (error) {
                
                setErrors({
                    requestId: '',
                    wantsCollection: '',
                    wantsExtraProducts: '',
                    collectedBuckets: '',
                    deliveredBuckets: '',
                    general: error.message || 'Error al cargar la solicitud de recolección actual.',
                });

                console.error('Error al cargar solicitud actual:', error);

            //Apaga el loading sin importar si la carga fue exitosa o si hubo un error
            } finally {
                setLoading(false);
            }
        };

        console.log('Values before if condition:', {
            clientId,
            weekStartDate,
            weekEndDate,
        });

        if (clientId && weekStartDate && weekEndDate) {
            console.log('If condition passed, loadCurrentCollectionRequest will run.');
            loadCurrentCollectionRequest();
        } else {
            console.log('If condition failed, missing required parameters.');
        }
    }, [clientId, weekStartDate, weekEndDate]);

    /**
     * Valida y guarda la primera sección del formulario.
     * Retorna al ViewModel padre el siguiente step sugerido.
     *
     * @returns {Promise<{success: boolean, nextStep?: number}>} Resultado del guardado.
     */

    const saveFirstSection = async () => {
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

            const collectionRequest = await saveCollectionRequestFirstSectionUseCase.execute(
                requestId,
                wantsCollection,
                wantsExtraProducts,
                Number(collectedBuckets),
                Number(deliveredBuckets),
            );

            
            return { 
                success: true, 
                nextStep: collectionRequest.wantsAdditionalProducts() ? 2 : 3,
            };
        } catch (error) {
            const msg = error.message || '';

            if (msg.includes('solicitud')) {
                setErrors({
                    requestId: msg,
                    wantsCollection: '',
                    wantsExtraProducts: '',
                    collectedBuckets: '',
                    deliveredBuckets: '',
                    general: '',
                });
            } else if (msg.includes('recolección')) {
                setErrors({
                    requestId: '',
                    wantsCollection: msg,
                    wantsExtraProducts: '',
                    collectedBuckets: '',
                    deliveredBuckets: '',
                    general: '',
                });
            } else if (msg.includes('productos extra')) {
                setErrors({
                    requestId: '',
                    wantsCollection: '',
                    wantsExtraProducts: msg,
                    collectedBuckets: '',
                    deliveredBuckets: '',
                    general: '',
                });
            } else if (msg.includes('recolectadas')) {
                setErrors({
                    requestId: '',
                    wantsCollection: '',
                    wantsExtraProducts: '',
                    collectedBuckets: msg,
                    deliveredBuckets: '',
                    general: '',
                });
            } else if (msg.includes('entregadas')) {
                setErrors({
                    requestId: '',
                    wantsCollection: '',
                    wantsExtraProducts: '',
                    collectedBuckets: '',
                    deliveredBuckets: msg,
                    general: '',
                });
            } else {
                setErrors({
                    requestId: '',
                    wantsCollection: '',
                    wantsExtraProducts: '',
                    collectedBuckets: '',
                    deliveredBuckets: '',
                    general: msg || 'Error al guardar la solicitud de recolección.',
                });
            }
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

        setWantsCollection,
        setWantsExtraProducts,
        setCollectedBuckets,
        setDeliveredBuckets,

        saveFirstSection,
    };
}

export default useCollectionRequestFirstSectionViewModel;