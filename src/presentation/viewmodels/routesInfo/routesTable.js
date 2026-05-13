import { useEffect, useState } from 'react';
import { GetRoutesInfoUseCase } from "../../../domain/useCases/routesInfo/routesTableUseCase";

/**
 * ViewModel para la gestión de información de rutas.
 * Actúa como intermediario entre la vista y la capa de dominio,
 * manejando la lógica de presentación y transformando los datos
 * para su consumo en la interfaz de usuario.
 * 
 * @function useRoutesViewModel
 */
function useRoutesViewModel(){
    const [routesList, setRoutesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRoutesInfo = new GetRoutesInfoUseCase();

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


    useEffect(() => {
        async function fetchRoutes(){
            setLoading(true);

            try{
                const routes = await getRoutesInfo.execute();
                setRoutesList(routes);
            } catch (error){
                setError(error.message || "Error al cargar la información");
            } finally {
                setLoading(false);
            }

        }

        fetchRoutes();
    }, []);

    return {
        routesList,
        loading,
        error,
        columnDefinitions,
        defaultColDef,
        copyLinkInfo,
    }
}

export default useRoutesViewModel;