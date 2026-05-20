import useClientTableViewModel from "../viewmodels/clientTableViewModel";
import ClientTableView from "./clientTableView";
import Navbar from "../../components/molecules/Navbar";
import CountersGroup from '../../components/molecules/CountersGroup';
import '../../css/clientView/client.css';

export default function ClientInfo(){

    const { 
        totalActiveFamilies,
        activeFamiliesByRoute,
     } = useClientTableViewModel();

    return(
        <div className="page">
            <Navbar />
            <div className="counters-row">
                {/* Contador Total de familias | Contador familias por ruta */}
                <CountersGroup 
                    counters={[
                        { label: "Total de Familias", value: totalActiveFamilies },
                        { label: "Familias por ruta", value: activeFamiliesByRoute },
                    ]}
                />
            </div>
            <ClientTableView />
        </div>
    )
}