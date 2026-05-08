import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientTable from "../../../components/organisms/ClientTable";
import { RoutesViewModel } from "../../viewmodels/routesInfo/routesTable";
import Loading from '../../../components/Template/loading';
import Error from '../../../components/Template/error';
import TimerAlert from '../../../components/Template/timerAlert';
import '../../../css/routesInfo/routesInfo.css'

/**
 * Componente de página que muestra la tabla de información de rutas del día actual.
 * Gestiona el estado de carga, errores y datos de rutas utilizando el ViewModel correspondiente.
 * Renderiza una tabla interactiva con AG-Grid mostrando detalles de cada ruta.
 */
export default function RoutesTablePage() {
    // ==================== ESTADO ====================
    const [routesList, setRoutesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

     /**
     * Instancia memoizada del ViewModel para evitar recreación en cada render.
     * @type {RoutesViewModel}
     */
    const viewModel = useMemo(() => new RoutesViewModel(), []);

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

    // ==================== EFECTOS ====================
    useEffect(() => {
        console.log("Entro al use effect de route table")
        async function fetchRoutesInfo() {
            setLoading(true);
            setError(null);

            const result = await viewModel.loadRoutesInfo();

            if (result.error) {
                setError(result.error);
            }

            setRoutesList(result.data);
            setLoading(false);
        }

        fetchRoutesInfo();
    }, [viewModel]);

    // ==================== RENDERIZADO CONDICIONAL ====================
    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error message={"Error al obtener la información"} />
    }

    // ==================== RENDERIZADO PRINCIPAL ====================
    return (
        <div className="table-container">
            <div className="table-scroll">
                <div className="ag-theme-alpine custom-green-theme">
                    <ClientTable
                        clientList={routesList}
                        columnDefinitions={columnDefinitions}
                        defaultColDef={defaultColDef}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
}