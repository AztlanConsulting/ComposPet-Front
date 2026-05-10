import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientTable from "../../../components/organisms/clientTable";
import useRoutesViewModel  from "../../viewmodels/routesInfo/routesTable";
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

    const routesViewModel = useRoutesViewModel();

    // ==================== RENDERIZADO CONDICIONAL ====================
    if (routesViewModel.loading) {
        return <Loading />
    }

    if (routesViewModel.error) {
        return <Error message={"Error al obtener la información"} />
    }

    // ==================== RENDERIZADO PRINCIPAL ====================
    return (
        <div className="table-container">
            <div className="table-scroll">
                <div className="ag-theme-alpine custom-green-theme">
                    <ClientTable
                        clientList={routesViewModel.routesList}
                        columnDefinitions={routesViewModel.columnDefinitions}
                        defaultColDef={routesViewModel.defaultColDef}
                        loading={routesViewModel.loading}
                    />
                </div>
            </div>
        </div>
    );
}