import { useState, useEffect } from 'react';

/**
 * ViewModel para la carga y validación de los catálogos del formulario de registro de clientes.
 * Gestiona la obtención asíncrona de los días de ruta disponibles y el estado
 * del dropdown de selección. Se comunica con la capa de dominio mediante
 * el caso de uso inyectado, siguiendo el patrón de arquitectura limpia.
 *
 */
function useRegisterClientCatalogViewModel(registerClientCatalogUseCase){

    const [daysOfRoutes, setDaysOfRoutes] = useState([]);

    const [selectedDay, setSelectedDay] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [successMessage, setSuccessMessage] = useState("");
    const [message, setMessage] = useState(false);

    const [dropdownErrors, setDropdownErrors] = useState({
        selectedDay: "",
    });

    /**
     * Valida que los campos de tipo dropdown del formulario tengan un valor seleccionado.
     * Se ejecuta en conjunto con `validateForm` al momento del envío del formulario.
     *
     * @returns {{ errors: Object, hasErrors: boolean }} Objeto con los mensajes de error
     * por dropdown y una bandera que indica si existe al menos un error.
     */
    const validateDropdowns = () => {
        const errors = { 
            selectedDay: "" 
        };

        let hasErrors = false;

        if (!selectedDay) {
            errors.selectedDay = "El día de ruta es requerido.";
            hasErrors = true;
        }

        return { errors, hasErrors };
    };

    useEffect(() => {
            /**
         * Carga los catálogos necesarios para el formulario al montar el componente.
         * En caso de error, almacena el mensaje para mostrarlo en la interfaz.
         */
        const fetchCatalogs = async () => {

            setLoading(true);
            setError("");
            setSuccessMessage("");

            try{
                const catalog = await registerClientCatalogUseCase.execute();
                setDaysOfRoutes(catalog.daysOfRoutes);
            } catch (err) {
                setError(err.message || 'Error al cargar los catálogos');
            } finally {
                setLoading(false);
            }
        };

        fetchCatalogs();
    }, []);

    /**
     * Actualiza el día de ruta seleccionado en el estado del ViewModel.
     *
     * @param {string} dia_ruta - Valor del día de ruta seleccionado en el dropdown.
     */
    const handleDayOfRouteChange = (dia_ruta) => {
        setSelectedDay(dia_ruta);

        setDropdownErrors(prev => ({
        ...prev,
        selectedDay: dia_ruta ? "" : "El día de ruta es requerido."
    }));
    };

    return {
        daysOfRoutes,

        selectedDay,

        handleDayOfRouteChange,

        loading,
        error,
        successMessage,
        message,

        dropdownErrors,
        setDropdownErrors,
        validateDropdowns,
    };

};

export default useRegisterClientCatalogViewModel;