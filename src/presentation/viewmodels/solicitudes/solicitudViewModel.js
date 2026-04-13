import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { SolicitudesRecApiClient } from "../../../data/datasources/solicitudesRecApiClient";    
import { SolicitudesRecRepository } from "../../../data/repositories/solicitudesRecRepository";

import { ObtenerSolicitudRecActualUseCase } from "../../../domain/useCases/obternerSoliciturRecActualUseCase";
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
    const errors = {
        idSolicitud: '',
        quiereRecoleccion: '',
        quiereProductosExtra: '',
        cubetasRecolectadas: '',
        cubetasEntregadas: '',
        general: '',
    };

    let hasErrors = false;

    if (!idSolicitud) {
        errors.idSolicitud = 'Id de solicitud no encontrado. Por favor regresa a la pantalla anterior.';
        hasErrors = true;
    }

    if (!quiereRecoleccion) {
        errors.quiereRecoleccion = 'Indica si deseas recolección.';
        hasErrors = true;
    }

    if (!quiereProductosExtra) {
        errors.quiereProductosExtra = 'Indica si deseas productos extra.';
        hasErrors = true;
    }

    if (quiereRecoleccion && cubetasRecolectadas <= 0) {
        errors.cubetasRecolectadas = 'La cantidad de cubetas recolectadas no puede ser igual o menor a 0.';
        hasErrors = true;
    }

    if (quiereRecoleccion === false && cubetasRecolectadas !== 0) {
        errors.cubetasRecolectadas = 'Si no deseas recolección, la cantidad de cubetas recolectadas debe ser 0.';
        hasErrors = true;
    }

    if (cubetasEntregadas < 0) {
        errors.cubetasEntregadas = 'La cantidad de cubetas entregadas no puede ser negativa.';
        hasErrors = true;
    }

    return { errors, hasErrors };
}

/**
 * ViewModel de la primera sección del formulario de recolección (FORM-02).
 * Gestiona el estado del formulario, ejecuta las validaciones locales
 * y orquesta la llamada a los casos de uso del módulo de solicitudes.
 *
 * @param {string} idCliente - Id del cliente autenticado en formato UUID.
 * @param {string} fechaInicioSemana - Fecha inicial del rango semanal.
 * @param {string} fechaFinSemana - Fecha final del rango semanal.
 * }}
 */

function useSolicitudRecPrimeraSeccionViewModel(idCliente, fechaInicioSemana, fechaFinSemana) {

    const navigate = useNavigate();


    const [idSolicitud, setIdSolicitud] = useState('');
    const [quiereRecoleccion, setQuiereRecoleccion] = useState(false);
    const [quiereProductosExtra, setQuiereProductosExtra] = useState(false);
    const [cubetasRecolectadas, setCubetasRecolectadas] = useState(0);
    const [cubetasEntregadas, setCubetasEntregadas] = useState(0);

    const [errors, setErrors] = useState({
        idSolicitud: '',
        quiereRecoleccion: '',
        quiereProductosExtra: '',
        cubetasRecolectadas: '',
        cubetasEntregadas: '',
        general: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const cargarSolicitudRecActual = async () => {
            setLoading(true);
            setErrors({
                idSolicitud: '',
                quiereRecoleccion: '',
                quiereProductosExtra: '',
                cubetasRecolectadas: '',
                cubetasEntregadas: '',
                general: '',
            });
            try {
                const apiClient = new SolicitudesRecApiClient();
                const solicitudesRecRepository = new SolicitudesRecRepository(apiClient);
                const obtenerSolicitudRecActualUseCase = new ObtenerSolicitudRecActualUseCase(solicitudesRecRepository);

                const solicitudRec = await obtenerSolicitudRecActualUseCase.execute(idCliente, fechaInicioSemana, fechaFinSemana);

                setIdSolicitud(solicitudRec.idSolicitud);
                setQuiereRecoleccion(solicitudRec.deseaRecoleccion());
                setQuiereProductosExtra(solicitudRec.deseaProductosExtra());
                setCubetasRecolectadas(solicitudRec.cubetasRecolectadas || 0);
                setCubetasEntregadas(solicitudRec.cubetasEntregadas || 0);
            } catch (error) {
                setErrors({
                    idSolicitud: '',
                    quiereRecoleccion: '',
                    quiereProductosExtra: '',
                    cubetasRecolectadas: '',
                    cubetasEntregadas: '',
                    general: error.message || 'Error al cargar la solicitud de recolección actual.',
                });
            } finally {
                setLoading(false);
            }
        };

        if (idCliente && fechaInicioSemana && fechaFinSemana) {
            cargarSolicitudRecActual();
        }
    }, [idCliente, fechaInicioSemana, fechaFinSemana]);

    /**
     * Maneja el envío de la primera sección del formulario de recolección.
     *
     * @param {React.FormEvent<HTMLFormElement>} e - Evento de envío del formulario.
     */

    const onSubmit = async (e) => {
        e.preventDefault();

        const { errors: validationErrors, hasErrors } = validateSolicitudRecPrimeraSeccion({
            idSolicitud,
            quiereRecoleccion,
            quiereProductosExtra,
            cubetasRecolectadas,
            cubetasEntregadas,
        });

        if (hasErrors) {
            setErrors(validationErrors);
            return;
        }

        setErrors({
            idSolicitud: '',
            quiereRecoleccion: '',
            quiereProductosExtra: '',
            cubetasRecolectadas: '',
            cubetasEntregadas: '',
            server: '',
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

            if (solicitudRec.deseaProductosExtra()) {
                navigate('/formulario-recoleccion/productos-extra');
                return;
            }

            navigate('/formulario-recoleccion/forma-pago');
        } catch (error) {
            const msg = error.message || '';

            if (msg.includes('solicitud')) {
                setErrors({
                    idSolicitud: msg,
                    quiereRecoleccion: '',
                    quiereProductosExtra: '',
                    cubetasRecolectadas: '',
                    cubetasEntregadas: '',
                    server: '',
                });
            } else if (msg.includes('recolección')) {
                setErrors({
                    idSolicitud: '',
                    quiereRecoleccion: msg,
                    quiereProductosExtra: '',
                    cubetasRecolectadas: '',
                    cubetasEntregadas: '',
                    server: '',
                });
            } else if (msg.includes('productos extra')) {
                setErrors({
                    idSolicitud: '',
                    quiereRecoleccion: '',
                    quiereProductosExtra: msg,
                    cubetasRecolectadas: '',
                    cubetasEntregadas: '',
                    server: '',
                });
            } else if (msg.includes('recolectadas')) {
                setErrors({
                    idSolicitud: '',
                    quiereRecoleccion: '',
                    quiereProductosExtra: '',
                    cubetasRecolectadas: msg,
                    cubetasEntregadas: '',
                    server: '',
                });
            } else if (msg.includes('entregadas')) {
                setErrors({
                    idSolicitud: '',
                    quiereRecoleccion: '',
                    quiereProductosExtra: '',
                    cubetasRecolectadas: '',
                    cubetasEntregadas: msg,
                    server: '',
                });
            } else {
                setErrors({
                    idSolicitud: '',
                    quiereRecoleccion: '',
                    quiereProductosExtra: '',
                    cubetasRecolectadas: '',
                    cubetasEntregadas: '',
                    server: msg || 'Error al guardar la solicitud de recolección.',
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
        onSubmit,
    };
}

export default useSolicitudRecPrimeraSeccionViewModel;