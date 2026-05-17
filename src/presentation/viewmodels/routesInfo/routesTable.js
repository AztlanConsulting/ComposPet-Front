import { useEffect, useState, useMemo, useCallback } from 'react';
import { 
    GetAvailableWeeksUseCase, 
    GetDaysOfRoutesUseCase, 
    GetFilteredRoutesUseCase, 
    GetRoutesInfoUseCase } from "../../../domain/useCases/routesInfo/routesTableUseCase";
import '../../../css/tokens/colors.css';

import { getRoutesTableColumns } from '../utils/routesTableColumnDefinitions';
import ProblemAlert from "../../../components/Template/ProblemAlert";
import AceptAlert from "../../../components/Template/AceptAlert";

/**
 * ViewModel para la gestión de información de rutas.
 * Actúa como intermediario entre la vista y la capa de dominio,
 * manejando la lógica de presentación y transformando los datos
 * para su consumo en la interfaz de usuario.
 * 
 * @function useRoutesViewModel
 */
function useRoutesViewModel(){
    const [weeks, setWeeks] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [daysOfRoutes, setDaysOfRoutes] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [routesList, setRoutesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [originalRoutesList, setOriginalRoutesList] = useState([]);
    const [editingRowId, setEditingRowId] = useState(null);

    const isCellChanged = useCallback((params) => {
        const rowId = params.data.name;
        const field = params.colDef.field;

        const originalRow = originalRoutesList.find(c => c.name === rowId);

        if(!originalRow) return false;
        
        return originalRow[field] !== params.value;
    }, [originalRoutesList]);

    const handleEdit = useCallback((params) => {

        if (editingRowId !== null) return;

        setEditingRowId(params.data.name);

        setTimeout(() => {
            params.api.startEditingCell({
                rowIndex: params.node.rowIndex,
                colKey: 'extraProducts', 
            });
        });
    }, [editingRowId]);

    const handleCancel = useCallback((params) => {
        try{
            setLoading(true);

            params.api.stopEditing(false);
            const rowId = params.data.name;
            const originalRow = originalRoutesList.find(r => r.name === rowId);

            if(!originalRow) return;

            params.node.setData({...originalRow});

            setEditingRowId(null);

            params.api.refreshCells({force: true});
        } catch (error) {
            console.log("Error discarding changes in routes table: ", error);
        } finally {
            setLoading(false);
        }
    }, [originalRoutesList]);


    const getRoutesInfo = new GetRoutesInfoUseCase();
    const getAvailableWeeks = new GetAvailableWeeksUseCase();
    const getDaysOfRoutes = new GetDaysOfRoutesUseCase();
    const getFilteredRoutes = new GetFilteredRoutesUseCase();

    const DAY_NAME_MAP = {
        0: "Domingo",
        1: "Lunes",
        2: "Martes",
        3: "Miércoles",
        4: "Jueves",
        5: "Viernes",
        6: "Sábado",
    };

    const formPath = "/formulario-recoleccion";
    const formUrl = `https://www.compospetmx.org${formPath}`;
    const formLink = `¡Excelente día!

*¿Te anotamos para recolección mañana?* 🪣🚛
Apóyanos contestando el formulario de recolección de nuestra página ${formUrl} para registrar tu recolección 🫶🏼`;

    const copyLinkInfo = {
        text: "Formulario de recolección",
        link: formLink,
        bubbleMessage: "¡Copiado!",
    };

    // Función para determinar si una fila debe tener fondo
    const hasRowBackground = (data) => {
        return (
            data?.hasRequest === true &&
            (
                data?.status === false ||
                (data?.wantsExtraProducts === false && data?.wantsCollection === false)
            )
        )
    }

    // funcion que determina si el fondo es rojo
    const hasRedBackground = (data) => {
        return data?.hasRequest === true && data?.status === false;
    };

    // ==================== CONFIGURACIÓN DE TABLA ====================
    const columnDefinitions = useMemo(() => 
        getRoutesTableColumns({
            editingRowId,
            isCellChanged,
            hasRowBackground,
            hasRedBackground,
            handleEdit,
            handleCancel,
            loading,
            showProblemAlert: async (title, text) => {
                await ProblemAlert({
                    title,
                    text
                });
            },
        }),
    [editingRowId, handleEdit, handleCancel, isCellChanged, loading]);

    /**
     * Configuración por defecto para todas las columnas de la tabla.
     * Habilita ordenamiento, redimensionamiento y tooltips.
     */
    const defaultColDef = {
        sortable: true,
        resizable: true,
        tooltipField: "notes",
        // Aplica estilo de negrita a toda la fila si tiene fondo rojo
        cellStyle: (params) => {
            if (hasRedBackground(params.data)) {
                return {
                    fontWeight: "var(--font-weight-bold)",
                };
            }

            return null;
        },
    };

    const getDefaultDay = (days) => {
        const todayBase = DAY_NAME_MAP[new Date().getDay()];
        return (
            days.find(d => d.dia_ruta === `${todayBase} 1`)?.dia_ruta ||
            days.find(d => d.dia_ruta.startsWith(todayBase))?.dia_ruta ||
            null
        );
    };

    const formatWeeks = (weeks) => {
        const countByMonth = {};

        return weeks.map((week) => {
            const date = new Date(week.weekStart);
            const month = date.toLocaleString("es-MX", { month: "long" });
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

            countByMonth[monthKey] = (countByMonth[monthKey] || 0) + 1;

            const weekNumber = countByMonth[monthKey];
            const monthFormat = month.charAt(0).toUpperCase() + month.slice(1);

            return {
                ...week,
                label: `Semana ${weekNumber} - ${monthFormat}`,
            };
        });
    }

    useEffect(() => {
        async function fetchWeeks() {
            try {
                const data = await getAvailableWeeks.execute();
                setWeeks(formatWeeks(data));

                const currentIndex = data.findIndex(week => {
                    const now = new Date();
                    return now >= new Date(week.weekStart) && now < new Date(week.weekEnd);
                });
                setSelectedWeek(currentIndex >= 0 ? currentIndex : data.length - 1);
            } catch (error){
                setError(error.message || "Error al cargar semanas");
            }
        }
        fetchWeeks();
    }, []);

    useEffect(() => {
        async function fetchDaysOfRoutes() {
            try {
                const data = await getDaysOfRoutes.execute();
                setDaysOfRoutes(data);

                setSelectedDay(getDefaultDay(data));
            } catch (error) {
                setError(error.message || "Error al cargar días de ruta");
            }
        }
        fetchDaysOfRoutes();
    }, []);

    useEffect(() => {
        if (selectedWeek === null || isNaN(selectedWeek) || selectedWeek < 0) return

        async function fetchRoutes(){
            setLoading(true);
            setError(null);

            try{
                const routes = await getFilteredRoutes.execute(
                    selectedWeek,
                    selectedDay || undefined
                );

                setRoutesList(routes);
                setOriginalRoutesList(JSON.parse(JSON.stringify(routes)));
                console.log("Rutas obtenidas:", routes);
            } catch (error){
                setError(error.message || "Error al cargar la información");
            } finally {
                setLoading(false);
            }
        }
        fetchRoutes();
    }, [selectedWeek, selectedDay]);

    const resetFilters = () => {
        const currentIndex = weeks.findIndex(week => {
            const now = new Date();
            return now >= new Date(week.weekStart) && now < new Date(week.weekEnd);
        });
        setSelectedWeek(currentIndex >= 0 ? currentIndex : weeks.length - 1);
        setSelectedDay(getDefaultDay(daysOfRoutes));
    };

    return {
        routesList,
        weeks,
        selectedWeek,
        setSelectedWeek,
        daysOfRoutes,
        selectedDay,
        setSelectedDay,
        loading,
        error,
        columnDefinitions,
        defaultColDef,
        resetFilters,
        copyLinkInfo,
    }
}

export default useRoutesViewModel;