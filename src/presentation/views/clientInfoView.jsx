import useClientTableViewModel from "../viewmodels/clientTableViewModel";
import ClientTableView from "./clientTableView";
import Navbar from "../../components/molecules/Navbar";
import CountersGroup from '../../components/molecules/CountersGroup';
import DropdownInput from '../../components/molecules/DropdownInput';
import '../../css/clientView/client.css';
import BalanceCountersGroup from "../../components/organisms/BalanceCountersGroup";
import Accordion from 'react-bootstrap/Accordion';

export default function ClientInfo(){

    const viewModel = useClientTableViewModel();

    const familyCounters = [
        { 
            label: "Total de Familias", 
            value: viewModel.totalActiveFamilies, 
            icon:'family', 
            color:'colorsIcon'
        },
        { 
            label: "Familias por ruta", 
            value: viewModel.activeFamiliesByRoute, 
            icon:'car', 
            color:'colorsIcon' 
        },
    ];

    const balanceCounters = [
        {
            title: 'Saldo favor',
            favorSubtitle: 'Ruta',
            favorBalance: viewModel.totalAmountPerRoute,
            pendingSubtitle: 'Total',
            pendingBalance: viewModel.totalAmount,
            icon:'moneyBag',
            color:'colorsIcon',
        },
        {
            title: 'Pendiente',
            favorSubtitle: 'Ruta',
            favorBalance: viewModel.pendingAmountPerRoute,
            pendingSubtitle: 'Total',
            pendingBalance: viewModel.pendingAmount,
            icon:'warning',
            color:'colorsIcon',
        },
    ];

    return(
        <div className="page">
            <Navbar />
            <div className="main">

                <div className="client-filter">
                    <DropdownInput
                        id="routeFilter"
                        value={viewModel.selectedRoute}
                        onChange={(e) => viewModel.setSelectedRoute(e.target.value)}
                        options={viewModel.routesDropdown}
                        className="dropdown"
                    >
                        <span className="dropdown-label">Filtrar por ruta</span>
                    </DropdownInput>
                </div>

                {/* Accordion mobile */}
                <div className="mobile-client-accordion">
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                Información de clientes
                            </Accordion.Header>

                            <Accordion.Body>
                                <div className="client-accordion-content">
                                    <CountersGroup counters={familyCounters} />

                                    <BalanceCountersGroup counters={balanceCounters} />
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>

                {/* Layout desktop */}
                <div className="counters-row desktop-client-counters">
                    <CountersGroup counters={familyCounters} />

                    <BalanceCountersGroup counters={balanceCounters} />
                </div>

                <ClientTableView viewModel={viewModel}/>
            </div>
        </div>
    )
}

