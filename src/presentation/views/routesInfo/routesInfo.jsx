import RoutesTablePage from "./routeTabla";
import Navbar from "../../../components/molecules/Navbar";
import CopyLink from "../../../components/molecules/CopyLink";
import IconActionBubble from "../../../components/molecules/IconActionBubble";
import useRoutesViewModel from "../../viewmodels/routesInfo/routesTable";
import ColorsInfo from "./colorsInfo";

import '../../../css/routesInfo/routesInfo.css';

export default function RoutesInfo(){
    const routesViewModel = useRoutesViewModel();

    return(
        <div className="page">
            <Navbar />
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
            <RoutesTablePage 
                routesViewModel={routesViewModel}
            />
            
            <ColorsInfo />
        </div>
    )
}