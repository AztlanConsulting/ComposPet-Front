import { useState, useEffect } from 'react';

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

    const handleDayOfRouteChange = (dia_ruta) => {
        setSelectedDay(dia_ruta);
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