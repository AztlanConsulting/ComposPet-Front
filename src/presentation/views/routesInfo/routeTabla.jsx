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
import SearchInput from "../../../components/molecules/searchInput";

/**
 * Componente de página que muestra la tabla de información de rutas del día actual.
 * Gestiona el estado de carga, errores y datos de rutas utilizando el ViewModel correspondiente.
 * Renderiza una tabla interactiva con AG-Grid mostrando detalles de cada ruta.
 */
export default function RoutesTablePage({ routesViewModel }) {

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
                <div className="filters-dropdowns">
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


            <div className="day-filter-group">

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
                </div>

                <div className="search-wrapper">
                    <SearchInput
                        value={routesViewModel.searchText}
                        onChange={(e) => routesViewModel.handleSearchText(e.target.value)}
                        placeholder="Buscar a un cliente por nombre"
                    />
                </div>

            </div>
                <ClientTable
                    clientList={routesViewModel.routesList}
                    columnDefinitions={routesViewModel.columnDefinitions}
                    defaultColDef={routesViewModel.defaultColDef}
                    loading={routesViewModel.loading}
                    getRowClass={routesViewModel.getRowClass}
                />
        </div>
    );
}