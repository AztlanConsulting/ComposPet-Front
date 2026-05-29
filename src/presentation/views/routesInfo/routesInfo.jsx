import RoutesTablePage from "./routeTabla";
import Navbar from "../../../components/molecules/Navbar";
import CopyLink from "../../../components/molecules/CopyLink";
import useRoutesViewModel from "../../viewmodels/routesInfo/routesTable";
import ColorsInfo from "./colorsInfo";
import BalanceCountersGroup from '../../../components/organisms/BalanceCountersGroup';
import CountersGroup from '../../../components/molecules/CountersGroup';
import DropdownInput from "../../../components/molecules/DropdownInput";
import Button from "../../../components/atoms/Button";
import Label from "../../../components/atoms/Label";
import Divider from "../../../components/atoms/Divider";
import ButtonActionAlert from "../../../components/Template/ButtonActionAlert";

import '../../../css/routesInfo/routesInfo.css';
import  '../../../components/atoms/Icon';

export default function RoutesInfo(){
    const routesViewModel = useRoutesViewModel();

    const {
        dayTotalAmount,
        routePayedAmount,
        routePendingAmount,
        weeklyPayedAmount,
        weeklyPendingAmount,
    } = routesViewModel;
    
    const isGoogleLoggedIn = sessionStorage.getItem('authProvider') === 'google';

    return(
        <div className="page">
            <Navbar />
            <div className="main">
                <div className="filters-container">
                    <div className="filters-dropdowns">
                        <div className="today">
                            <Label id="Hoy" className="label-today" size="md">Hoy</Label>
                            <Button size='medium' csstype='accept' className='button button-today'
                                onClick={routesViewModel.resetFilters}>
                                {new Date().getDate()}
                            </Button>
                        </div>
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
                        <div className="summary-card">
                            <CountersGroup
                                counters={[
                                    { label: "Sumatoria total", value: dayTotalAmount, icon:'moneySign', color:'colorsIcon'  },
                                ]}
                            />
                        </div>
                        <div className="center-balance-group">
                            <BalanceCountersGroup
                                counters={[
                                    {
                                        title: 'Saldo favor',
                                        favorSubtitle: 'Ruta',
                                        favorBalance: routePayedAmount,
                                        pendingSubtitle: 'Semana',
                                        pendingBalance: weeklyPayedAmount,
                                        icon:'moneyBag',
                                        color:'colorsIcon',
                                    },
                                    {
                                        title: 'Pendiente',
                                        favorSubtitle: 'Ruta',
                                        favorBalance: routePendingAmount,
                                        pendingSubtitle: 'Semana',
                                        pendingBalance: weeklyPendingAmount,
                                        icon:'warning',
                                        color:'colorsIcon',
                                    },
                                ]}
                            />
                        </div>
                    </div>
                    <div className="actions-section">
                        <Divider />
                        <div className="buttons-section-container">
                            <ButtonActionAlert
                                onAction={routesViewModel.handleGenerateMessages}
                                successMessage="Mensajes generados exitosamente"
                                errorMessage="Ocurrió un error al generar los mensajes"
                                className="button-actions"
                                disabled={!isGoogleLoggedIn}
                            >
                                Generar mensajes
                            </ButtonActionAlert>
                            <Button size='medium' csstype='accept' className='button-actions'
                                onClick={routesViewModel.handleOpenRoutesSheet}
                                disabled={!isGoogleLoggedIn}
                            >
                                Resumen de ruta
                            </Button>
                        </div>
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