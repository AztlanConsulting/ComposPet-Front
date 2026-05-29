import RoutesTablePage from "./routeTabla";
import Navbar from "../../../components/molecules/Navbar";
import CopyLink from "../../../components/molecules/CopyLink";
import IconActionBubble from "../../../components/molecules/IconActionBubble";
import useRoutesViewModel from "../../viewmodels/routesInfo/routesTable";
import ColorsInfo from "./colorsInfo";
import BalanceCountersGroup from '../../../components/organisms/BalanceCountersGroup';
import CountersGroup from '../../../components/molecules/CountersGroup';
import DropdownInput from "../../../components/molecules/DropdownInput";
import Button from "../../../components/atoms/Button";

import '../../../css/routesInfo/routesInfo.css';

export default function RoutesInfo(){
    const routesViewModel = useRoutesViewModel();

    const {
        dayTotalAmount,
        routePayedAmount,
        routePendingAmount,
        weeklyPayedAmount,
        weeklyPendingAmount,
    } = routesViewModel;

    return(
        <div className="page">
            <Navbar />
            <div className="main">
                <div className="filters-container">
                    <div className="filters-dropdowns">
                            <Button size='medium' csstype='accept' className='button button-today'
                                onClick={routesViewModel.resetFilters}>
                                Hoy
                            </Button>

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
                                Día de ruta
                            </DropdownInput>
                    </div>
                    <div className="copy-link-container">
                        <CopyLink {...routesViewModel.copyLinkInfo} />
                    </div>
                </div>

                <div className="route-header-row">
                    <div className="route-counters-section">
                        <BalanceCountersGroup
                            counters={[
                                {
                                    title: 'Ruta',
                                    favorSubtitle: 'Pagado',
                                    favorBalance: routePayedAmount,
                                    pendingSubtitle: 'Pendiente',
                                    pendingBalance: routePendingAmount,
                                },
                                {
                                    title: 'Semana',
                                    favorSubtitle: 'Pagado',
                                    favorBalance: weeklyPayedAmount,
                                    pendingSubtitle: 'Pendiente',
                                    pendingBalance: weeklyPendingAmount,
                                },
                            ]}
                        />
                        <CountersGroup 
                            counters={[
                                { label: "Sumatoria total", value: dayTotalAmount },
                            ]}
                        />
                        <IconActionBubble
                            text="Generar mensajes de confirmación"
                            iconName="googleSheets"
                            bubbleMessage="¡Mensajes generados!"
                            errorMessage="Ups, algo salió mal"
                            onAction={routesViewModel.handleGenerateMessages}
                        />
                    </div>
                </div>
            <RoutesTablePage 
                routesViewModel={routesViewModel}
            />
            
            <ColorsInfo />
            </div>
        </div>
    );
}