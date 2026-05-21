import useClientTableViewModel from "../viewmodels/clientTableViewModel";
import ClientTable from "../../components/organisms/ClientTable";
import '../../css/atoms/clientTableColumnsDef.css';
import Navbar from "../../components/molecules/Navbar";
import ProblemAlert from "../../components/Template/ProblemAlert";
import DropdownInput from '../../components/molecules/DropdownInput';
import Loading from '../../components/Template/loading';
import '../../css/clientView/client.css';
import SearchInput from "../../components/molecules/searchInput";

/**
 * Vista de la información de los clientes de Compospet
 *
 * @returns {JSX.Element} Vista icon la tabla de usuarios de Compospet.
 */
export default function ClientTableView() {

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
        totalActiveFamilies,
        activeFamiliesByRoute,
        totalAmount,
        pendingAmount,
        totalAmountPerRoute,
        pendingAmountPerRoute,
    } = useClientTableViewModel();

    // ==================== RENDERIZADO CONDICIONAL ====================
    if (loading) {
        return <Loading />
    }

    // ==================== RENDERIZADO PRINCIPAL ====================

return (
    
    <div className="client-table-container">

        <Navbar />
        <section className="content-wrapper">
            <div className="counters-row">
                {/* Contador Total de familias | Contador familias por ruta */}
                <CountersGroup 
                    counters={[
                        { label: "Total de Familias", value: totalActiveFamilies },
                        { label: "Familias por ruta", value: activeFamiliesByRoute },
                    ]}
                />

                <BalanceCountersGroup
                    counters={[
                        {
                        title: 'Saldo total de ruta',
                        favorSubtitle: 'Saldo a favor',
                        favorBalance: totalAmountPerRoute,
                        pendingSubtitle: 'Saldo pendiente',
                        pendingBalance: pendingAmountPerRoute,
                        },
                        {
                        title: 'Saldo total',
                        favorSubtitle: 'Saldo a favor',
                        favorBalance: totalAmount,
                        pendingSubtitle: 'Saldo pendiente',
                        pendingBalance: pendingAmount,
                        },
                    ]}
                />
            </div>

            <div className="client-filters-container">
                {/* Dropdown para filtro */}
                <div className="route-filter">
                    <DropdownInput
                        id="routeFilter"
                        value={selectedRoute}
                        onChange={(e) => setSelectedRoute(e.target.value)}
                        options={routesDropdown}
                        className="dropdown"
                    />
                </div>

                <div className="client-search-wrapper">
                    <SearchInput
                        value={searchText}
                        onChange={(e) => handleSearchText(e.target.value)}
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
        </section>
    </div>
    );
}