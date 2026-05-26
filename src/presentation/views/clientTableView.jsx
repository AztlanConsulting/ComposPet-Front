import ClientTable from "../../components/organisms/ClientTable";
import '../../css/atoms/clientTableColumnsDef.css';
import DropdownInput from '../../components/molecules/DropdownInput';
import Loading from '../../components/Template/loading';
import '../../css/clientView/client.css';
import SearchInput from "../../components/molecules/searchInput";
import CompostStatusSwitch from "../../components/molecules/CompostStatusSwitch";

/**
 * Vista de la información de los clientes de Compospet
 *
 * @returns {JSX.Element} Vista icon la tabla de usuarios de Compospet.
 */
export default function ClientTableView({ viewModel }) {

    const {
        loading,
        clientList,
        columnDefinitions,
        defaultColDef,
        editingRowId,
        routesDropdown,
        selectedRoute,
        setSelectedRoute,
        searchText,
        setSearchText,
        handleSearchText,
        compostStatus,
        getCompostStatus,
        handleCompostStatusChange,
    } = viewModel;

    // ==================== RENDERIZADO CONDICIONAL ====================
    if (loading) {
        return <Loading />
    }

    // ==================== RENDERIZADO PRINCIPAL ====================

return (
    
    <div className="client-table-container">
        <div className="client-filters-container">
            {/* Dropdown para filtro */}
            <div className="client-filter">
                <DropdownInput
                    id="routeFilter"
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                    options={routesDropdown}
                    className="dropdown"
                >
                    <span className="dropdown-label">Filtrar por ruta</span>
                </DropdownInput>
            </div>

                <div className="compost-switch-wrapper">
                    <CompostStatusSwitch
                        id="compost-status"
                        label="Entrega de composta"
                        checked={compostStatus}
                        onChange={handleCompostStatusChange}
                        size="sm"
                    />
                </div>

                <div className="client-search-wrapper">
                    <SearchInput
                        value={searchText}
                        onChange={(e) => handleSearchText(e.target.value)}
                        onInput={(e) => handleSearchText(e.target.value)}
                        placeholder="Buscar a un cliente por nombre"
                    />
                </div>
            </div>

            <ClientTable
                loading={loading}
                clientList={clientList}
                columnDefinitions={columnDefinitions}
                defaultColDef={defaultColDef}
                editingRowId={editingRowId}
            >
            </ClientTable>
    </div>
    );
}