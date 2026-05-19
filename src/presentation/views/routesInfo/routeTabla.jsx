import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientTable from "../../../components/organisms/ClientTable";
import useRoutesViewModel  from "../../viewmodels/routesInfo/routesTable";
import Loading from '../../../components/Template/loading';
import Error from '../../../components/Template/error';
import TimerAlert from '../../../components/Template/timerAlert';
import '../../../css/routesInfo/routesInfo.css'
import Icon from '../../../components/atoms/Icon';
import DropdownInput from "../../../components/molecules/DropdownInput";

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

            <div className="filters-container">
                <DropdownInput
                    id="weeks"
                    size="md"
                    value={routesViewModel.selectedWeek ?? ""}
                    onChange={(e) => routesViewModel.setSelectedWeek(Number(e.target.value))}
                    options={
                        routesViewModel.weeks.map((w, i) => ({
                            value: i,
                            label: w.label,
                        }))}
                >
                    Semana
                </DropdownInput>

                <DropdownInput
                    id="days"
                    size="md"
                    value={routesViewModel.selectedDay ?? ""}
                    onChange={(e) => routesViewModel.setSelectedDay(e.target.value || null)}
                    options={routesViewModel.daysOfRoutes.map(s => ({
                        value: s.dia_ruta,
                        label: s.dia_ruta,
                    }))}
                >
                    Dia de ruta
                </DropdownInput>

                <Icon 
                    name="reload" 
                    size="large" 
                    className="reload-icon" 
                    onClick={routesViewModel.resetFilters}
                />
            </div>

            <div className="table-scroll">
                <div className="ag-theme-alpine custom-green-theme">
                    <ClientTable
                        clientList={routesViewModel.routesList}
                        columnDefinitions={routesViewModel.columnDefinitions}
                        defaultColDef={routesViewModel.defaultColDef}
                        loading={routesViewModel.loading}
                        getRowClass={routesViewModel.getRowClass}
                    />
                </div>
            </div>
        </div>
    );
}