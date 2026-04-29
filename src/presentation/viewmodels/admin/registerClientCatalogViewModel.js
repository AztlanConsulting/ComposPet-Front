import { useState, useEffect } from 'react';

function useRegisterClientCatalogViewModel(registerClientCatalogUseCase){

    const [states, setStates] = useState([]);
    const [towns, setTowns] = useState([]);
    const [zones, setZones] = useState([]);
    const [daysOfRoutes, setDaysOfRoutes] = useState([]);

    const [selectedState, setSelectedState] = useState(null);
    const [selectedTown, setSelectedTown] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [successMessage, setSuccessMessage] = useState("");
    const [message, setMessage] = useState(false);

    const [dropdownErrors, setDropdownErrors] = useState({
        selectedState: "",
        selectedTown: "",
        selectedZone: "",
        selectedDay: "",
    });

    const validateDropdowns = () => {
        const errors = { 
            selectedState: "", 
            selectedTown: "", 
            selectedZone: "", 
            selectedDay: "" 
        };

        let hasErrors = false;

        if (!selectedState) {
            errors.selectedState = "El estado es requerido.";
            hasErrors = true;
        }
        if (!selectedTown) {
            errors.selectedTown = "El municipio es requerido.";
            hasErrors = true;
        }
        if (!selectedZone) {
            errors.selectedZone = "La zona es requerida.";
            hasErrors = true;
        }
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
                setStates(catalog.states);
                setTowns(catalog.towns);
                setZones(catalog.zones);
                setDaysOfRoutes(catalog.daysOfRoutes);
            } catch (err) {
                setError(err.message || 'Error al cargar los catálogos');
            } finally {
                setLoading(false);
            }
        };

        fetchCatalogs();
    }, []);

    // Filtrar zonas según el estado y municipio seleccionados
    const filteredZones = zones.filter(
        z => z.id_estado === selectedState && z.id_municipio === selectedTown
    );

    // Filtrar dias de ruta segun la zona
    const filteredDaysOfRoute = daysOfRoutes.filter(
        df => df.id_zona === selectedZone
    );

    // Al cambiar estado, limpia municipio, zona y día
    const handleStateChange = (id_estado) => {
        setSelectedState(id_estado);
        setSelectedTown(null);
        setSelectedZone(null);
        setSelectedDay(null);
    };

    // Al cambiar municipio, limpia zona y día
    const handleTownChange = (id_municipio) => {
        setSelectedTown(id_municipio);
        setSelectedZone(null);
        setSelectedDay(null);
    };

    const handleZoneChange = (id_zona) => {
        setSelectedZone(id_zona);
        setSelectedDay(null);
    };

    const handleDayOfRouteChange = (dia_ruta) => {
        setSelectedDay(dia_ruta);
    };

    return {
        states,
        towns,
        zones: filteredZones,
        daysOfRoutes: filteredDaysOfRoute,

        selectedState,
        selectedTown,
        selectedZone,
        selectedDay,

        handleStateChange,
        handleTownChange,
        handleZoneChange,
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