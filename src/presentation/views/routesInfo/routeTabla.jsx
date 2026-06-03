import ClientTable from "../../../components/organisms/ClientTable";
import Loading from '../../../components/Template/loading';
import Error from '../../../components/Template/error';
import '../../../css/routesInfo/routesInfo.css'
import SearchInput from "../../../components/molecules/searchInput";
import Button from "../../../components/atoms/Button";

/**
 * Componente de página que muestra la tabla de información de rutas del día actual.
 * Gestiona el estado de carga, errores y datos de rutas utilizando el ViewModel correspondiente.
 * Renderiza una tabla interactiva con AG-Grid mostrando detalles de cada ruta.
 */
export default function RoutesTablePage({
    routesViewModel,
}) {
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

                <div className="search-wrapper">
                    <SearchInput
                        value={routesViewModel.searchText}
                        onChange={(e) => routesViewModel.handleSearchText(e.target.value)}
                        placeholder="Buscar por nombre"
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