import RoutesTablePage from "./routeTabla";
import Navbar from "../../../components/molecules/Navbar";
import CopyLink from "../../../components/molecules/CopyLink";
import IconActionBubble from "../../../components/molecules/IconActionBubble";
import useRoutesViewModel from "../../viewmodels/routesInfo/routesTable";
import ColorsInfo from "./colorsInfo";
import BalanceCountersGroup from '../../../components/organisms/BalanceCountersGroup';
import CountersGroup from '../../../components/molecules/CountersGroup';
import '../../../css/routesInfo/routesInfo.css';

export default function RoutesInfo(){
    const routesViewModel = useRoutesViewModel();

    const { 
        copyLinkInfo,
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