import { useEffect, useState } from "react";

import { SolicitudesRecApiClient } from "../../../data/datasources/solicitudesRecApiClient";    
import { SolicitudesRecRepository } from "../../../data/repositories/solicitudesRecRepository";

// UseCases
import { ObtenerSolicitudRecActualUseCase } from "../../../domain/useCases/obternerSolicitudRecActualUseCase";
import { GuardarSolicitudRecPrimeraSeccionUseCase } from "../../../domain/useCases/guardarSolicitudRecPrimeraSeccionUseCase";

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

function validateSolicitudRecPrimeraSeccion({
    idSolicitud,
    quiereRecoleccion,
    quiereProductosExtra,
    cubetasRecolectadas,
    cubetasEntregadas,
}) {
    //Objeto donde se almacenarán los mensajes de error para cada campo
    const errors = {
        idSolicitud: '',
        quiereRecoleccion: '',
        quiereProductosExtra: '',
        cubetasRecolectadas: '',
        cubetasEntregadas: '',
        general: '',
    };

    let hasErrors = false;

    //Validación del Id
    if (!idSolicitud) {
        errors.idSolicitud = 'Id de solicitud no encontrado. Por favor regresa a la pantalla anterior.';
        hasErrors = true;
    }

    if (quiereRecoleccion === undefined || quiereRecoleccion === null) {
        errors.quiereRecoleccion = 'Indica si deseas recolección.';
        hasErrors = true;
    }

    if (quiereProductosExtra === undefined || quiereProductosExtra === null) {
        errors.quiereProductosExtra = 'Indica si deseas productos extra.';
        hasErrors = true;
    }

    //Si el cliente desea recolección, la cantidad de cubetas recolectadas debe ser mayor a 0
    if (quiereRecoleccion && cubetasRecolectadas <= 0) {
        errors.cubetasRecolectadas = 'La cantidad de cubetas que vas a entregar no puede ser igual o menor a 0.';
        hasErrors = true;
    }

    //Si el cliente no desea recolección, la cantidad de cubetas recolectadas debe ser 0
    if (quiereRecoleccion === false && cubetasRecolectadas !== 0) {
        errors.cubetasRecolectadas = 'Si no deseas recolección, la cantidad de cubetas que vas a entregar debe ser 0.';
        hasErrors = true;
    }

    //Regresa el resultado de la validación
    return { errors, hasErrors };
}

/**
 * ViewModel de la primera sección del formulario de recolección (FORM-02)
 * Gestiona el estado del formulario, ejecuta las validaciones locales
 * Maneja la lógica de carga, validación y guardado de la primera sección
 *
 * @param {string} idCliente - Id del cliente autenticado en formato UUID.
 * @param {string} fechaInicioSemana - Fecha inicial del rango semanal.
 * @param {string} fechaFinSemana - Fecha final del rango semanal.
 * @returns {object} Estado y acciones del step 1.
 */

function useSolicitudRecPrimeraSeccionViewModel(idCliente, fechaInicioSemana, fechaFinSemana) {

    console.log('Inicializando ViewModel step 1 con:', {
    idCliente,
    fechaInicioSemana,
    fechaFinSemana,
    });
    //Estados iniciales del formulario para valores controlados de las moleculas
    const [idSolicitud, setIdSolicitud] = useState('');
    const [quiereRecoleccion, setQuiereRecoleccion] = useState(null);
    const [quiereProductosExtra, setQuiereProductosExtra] = useState(null);
    const [cubetasRecolectadas, setCubetasRecolectadas] = useState(0);
    const [cubetasEntregadas, setCubetasEntregadas] = useState(0);

    //Estado inicial de los errores
    //Puede que no sea necesario, por que nunca tendria error inicial
    const [errors, setErrors] = useState({
        idSolicitud: '',
        quiereRecoleccion: '',
        quiereProductosExtra: '',
        cubetasRecolectadas: '',
        cubetasEntregadas: '',
        general: '',
    });

    //Saber si se está cargando la solicitud actual o guardando los datos, para mostrar en la UI
    const [loading, setLoading] = useState(false);

    //Carga la solicitud de recolección actual del cliente al montar el componente
    useEffect(() => {
        
        console.log('Entró al useEffect de cargar solicitud');

        const cargarSolicitudRecActual = async () => {

            console.log('No pasó el if, faltan parámetros');

            setLoading(true);
            //Limpiar errores antes de cargar
            setErrors({
                idSolicitud: '',
                quiereRecoleccion: '',
                quiereProductosExtra: '',
                cubetasRecolectadas: '',
                cubetasEntregadas: '',
                general: '',
            });

            try {
                //Construye capa de dominio para obtener la solicitud de recolección actual
                const apiClient = new SolicitudesRecApiClient();
                const solicitudesRecRepository = new SolicitudesRecRepository(apiClient);
                const obtenerSolicitudRecActualUseCase = new ObtenerSolicitudRecActualUseCase(
                    solicitudesRecRepository
                );

                console.log('Voy a ejecutar ObtenerSolicitudRecActualUseCase con:', {
                    idCliente,
                    fechaInicioSemana,
                    fechaFinSemana,
                });

                //Ejecuta el caso de uso para obtener la solicitud de recolección actual del cliente
                const solicitudRec = await obtenerSolicitudRecActualUseCase.execute(
                    idCliente, 
                    fechaInicioSemana, 
                    fechaFinSemana
                );

                console.log('Respuesta del caso de uso:', solicitudRec);

                //Guarda los datos para mostrarlos, si existe la solicitud de recolección actual, en caso contrario se mantienen los valores iniciales
                setIdSolicitud(solicitudRec.idSolicitud);
                setQuiereRecoleccion(solicitudRec.deseaRecoleccion());
                setQuiereProductosExtra(solicitudRec.deseaProductosExtra());
                setCubetasRecolectadas(solicitudRec.cubetasRecolectadas || 0);
                setCubetasEntregadas(solicitudRec.cubetasEntregadas || 0);
            
            //Manejo de errores de la solicitud de recolección actual
            } catch (error) {
                
                setErrors({
                    idSolicitud: '',
                    quiereRecoleccion: '',
                    quiereProductosExtra: '',
                    cubetasRecolectadas: '',
                    cubetasEntregadas: '',
                    general: error.message || 'Error al cargar la solicitud de recolección actual.',
                });

                console.error('Error al cargar solicitud actual:', error);

            //Apaga el loading sin importar si la carga fue exitosa o si hubo un error
            } finally {
                setLoading(false);
            }
        };

        console.log('Valores antes del if:', {
            idCliente,
            fechaInicioSemana,
            fechaFinSemana,
        });

        if (idCliente && fechaInicioSemana && fechaFinSemana) {
            console.log('Sí pasó el if, se ejecutará cargarSolicitudRecActual');
            cargarSolicitudRecActual();
        }else {
            console.log('No pasó el if, faltan parámetros');
        }
    }, [idCliente, fechaInicioSemana, fechaFinSemana]);

    /**
     * Valida y guarda la primera sección del formulario.
     * Retorna al ViewModel padre el siguiente step sugerido.
     *
     * @returns {Promise<{success: boolean, nextStep?: number}>} Resultado del guardado.
     */

    const guardarPrimeraSeccion = async () => {
        const { errors: validationErrors, hasErrors } = validateSolicitudRecPrimeraSeccion({
            idSolicitud,
            quiereRecoleccion,
            quiereProductosExtra,
            cubetasRecolectadas,
            cubetasEntregadas,
        });

        if (hasErrors) {
            setErrors(validationErrors);
            return { success: false };
        }

        setErrors({
            idSolicitud: '',
            quiereRecoleccion: '',
            quiereProductosExtra: '',
            cubetasRecolectadas: '',
            cubetasEntregadas: '',
            general: '',
        });

        setLoading(true);

        try {
            const apiClient = new SolicitudesRecApiClient();
            const solicitudesRecRepository = new SolicitudesRecRepository(apiClient);
            const guardarSolicitudRecPrimeraSeccionUseCase = new GuardarSolicitudRecPrimeraSeccionUseCase(
                solicitudesRecRepository,
            );

            const solicitudRec = await guardarSolicitudRecPrimeraSeccionUseCase.execute(
                idSolicitud,
                quiereRecoleccion,
                quiereProductosExtra,
                Number(cubetasRecolectadas),
                Number(cubetasEntregadas),
            );

            
            return { 
                success: true, 
                nextStep: solicitudRec.deseaProductosExtra() ? 2 : 3,
            };
        } catch (error) {
            const msg = error.message || '';

            if (msg.includes('solicitud')) {
                setErrors({
                    idSolicitud: msg,
                    quiereRecoleccion: '',
                    quiereProductosExtra: '',
                    cubetasRecolectadas: '',
                    cubetasEntregadas: '',
                    general: '',
                });
            } else if (msg.includes('recolección')) {
                setErrors({
                    idSolicitud: '',
                    quiereRecoleccion: msg,
                    quiereProductosExtra: '',
                    cubetasRecolectadas: '',
                    cubetasEntregadas: '',
                    general: '',
                });
            } else if (msg.includes('productos extra')) {
                setErrors({
                    idSolicitud: '',
                    quiereRecoleccion: '',
                    quiereProductosExtra: msg,
                    cubetasRecolectadas: '',
                    cubetasEntregadas: '',
                    general: '',
                });
            } else if (msg.includes('recolectadas')) {
                setErrors({
                    idSolicitud: '',
                    quiereRecoleccion: '',
                    quiereProductosExtra: '',
                    cubetasRecolectadas: msg,
                    cubetasEntregadas: '',
                    general: '',
                });
            } else if (msg.includes('entregadas')) {
                setErrors({
                    idSolicitud: '',
                    quiereRecoleccion: '',
                    quiereProductosExtra: '',
                    cubetasRecolectadas: '',
                    cubetasEntregadas: msg,
                    general: '',
                });
            } else {
                setErrors({
                    idSolicitud: '',
                    quiereRecoleccion: '',
                    quiereProductosExtra: '',
                    cubetasRecolectadas: '',
                    cubetasEntregadas: '',
                    general: msg || 'Error al guardar la solicitud de recolección.',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        idSolicitud,
        quiereRecoleccion,
        quiereProductosExtra,
        cubetasRecolectadas,
        cubetasEntregadas,
        errors,
        loading,

        setQuiereRecoleccion,
        setQuiereProductosExtra,
        setCubetasRecolectadas,
        setCubetasEntregadas,

        guardarPrimeraSeccion,
    };
}

export default useSolicitudRecPrimeraSeccionViewModel;