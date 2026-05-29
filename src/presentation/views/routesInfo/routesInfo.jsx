import RoutesTablePage from "./routeTabla";
import Navbar from "../../../components/molecules/Navbar";
import CopyLink from "../../../components/molecules/CopyLink";
import IconActionBubble from "../../../components/molecules/IconActionBubble";
import useRoutesViewModel from "../../viewmodels/routesInfo/routesTable";
import ColorsInfo from "./colorsInfo";
import BalanceCountersGroup from '../../../components/organisms/BalanceCountersGroup';
import CountersGroup from '../../../components/molecules/CountersGroup';
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

    return(
        <div className="page">
            <Navbar />
            <div className="main">
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
                    <div className="copy-link-container">
                        <CopyLink {...routesViewModel.copyLinkInfo} />
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