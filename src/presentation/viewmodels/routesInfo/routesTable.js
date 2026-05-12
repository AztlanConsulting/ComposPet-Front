import { useEffect, useState } from 'react';
import { GetAvailableWeeksUseCase, GetDaysOfRoutesUseCase, GetFilteredRoutesUseCase, GetRoutesInfoUseCase } from "../../../domain/useCases/routesInfo/routesTableUseCase";

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

    const getRoutesInfo = new GetRoutesInfoUseCase();
    const getAvailableWeeks = new GetAvailableWeeksUseCase();
    const getDaysOfRoutes = new GetDaysOfRoutesUseCase();
    const getFilteredRoutes = new GetFilteredRoutesUseCase();

    // ==================== CONFIGURACIÓN DE TABLA ====================
    const columnDefinitions = [
        { headerName: "Nombre", field: "name", width: 200},
        { headerName: "# Recolección", field: "collectedBuckets", width: 200},
        { headerName: "# Entrega", field: "deliveredBuckets", width: 200},
        { headerName: "Productos Extra", field: "extraProducts", width: 200},
        { headerName: "Horario", field: "schedule", width: 200},
        { headerName: "Forma de pago", field: "paymentMethod", width: 200},
        { headerName: "Total a pagar", field: "totalToPay", width: 200},
        { headerName: "Total pagado", field: "totalPaid", width: 200},
        { headerName: "Notas", field: "notes", width: 200},
    ];

    /**
     * Configuración por defecto para todas las columnas de la tabla.
     * Habilita ordenamiento, redimensionamiento y tooltips.
     */
    const defaultColDef = {
        sortable: true,
        resizable: true,
        tooltipField: "notes",
    };

    const formatWeeks = (weeks) => {
        const countByMonth = {};

        return weeks.map((week) => {
            const date = new Date(week.weekStart);
            const month = date.toLocaleString("es-MX", { month: "long" });
            console.log(month);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            console.log(monthKey);

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
            } catch (error) {
                setError(error.message || "Error al cargar días de ruta");
            }
        }
        fetchDaysOfRoutes();
    }, []);

    useEffect(() => {
        console.log("=== fetchRoutes disparado ===");
        console.log("selectedWeek:", selectedWeek, typeof selectedWeek);
        console.log("selectedDay:", selectedDay, typeof selectedDay);

        async function fetchRoutes(){
            setLoading(true);
            setError(null);

            try{
                // const routes = await getRoutesInfo.execute();
                const routes = selectedWeek !== null
                    ? await getFilteredRoutes.execute(selectedWeek, selectedDay || undefined)
                    : await getRoutesInfo.execute();
                setRoutesList(routes);
            } catch (error){
                setError(error.message || "Error al cargar la información");
            } finally {
                setLoading(false);
            }
        }
        fetchRoutes();
    }, [selectedWeek, selectedDay]);

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
    }
}

export default useRoutesViewModel;