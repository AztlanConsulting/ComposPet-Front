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
import Accordion from 'react-bootstrap/Accordion';

import '../../../css/routesInfo/routesInfo.css';
import '../../../css/atoms/button.css';

import '../../../components/atoms/Icon';

export default function RoutesInfo() {
    const routesViewModel = useRoutesViewModel();

    const {
        dayTotalAmount,
        routePayedAmount,
        routePendingAmount,
        weeklyPayedAmount,
        weeklyPendingAmount,
    } = routesViewModel;

    const isGoogleLoggedIn =
        sessionStorage.getItem('authProvider') === 'google';

    return (
        <div className="page">
            <Navbar />

            <div className="main">
                <div className="filters-container">
                    <div className="filters-dropdowns">
                    <div className="today">
                        <Label id="Mañana" className="label-today" size="md">
                            Mañana
                        </Label>

                        <Button
                            size="medium"
                            csstype="accept"
                            className="button button-today"
                            onClick={routesViewModel.resetFilters}
                        >
                            {new Date(new Date().setDate(new Date().getDate() + 1)).getDate()}
                        </Button>
                    </div>

                        <DropdownInput
                            id="weeks"
                            size="md"
                            className="dropdown formField"
                            value={routesViewModel.selectedWeek ?? ""}
                            onChange={(e) =>
                                routesViewModel.setSelectedWeek(
                                    Number(e.target.value)
                                )
                            }
                            options={
                                routesViewModel.weeks.map((w, i) => ({
                                    value: i,
                                    label: w.label,
                                }))
                            }
                        >
                            Semana
                        </DropdownInput>

                        <DropdownInput
                            id="days"
                            size="md"
                            className="dropdown formField"
                            value={routesViewModel.selectedDay ?? ""}
                            onChange={(e) =>
                                routesViewModel.setSelectedDay(
                                    e.target.value || null
                                )
                            }
                            options={
                                routesViewModel.daysOfRoutes.map((s) => ({
                                    value: s.dia_ruta,
                                    label: s.dia_ruta,
                                }))
                            }
                        >
                            Día de ruta
                        </DropdownInput>
                    </div>

                    <div className="copy-link-container">
                        <CopyLink {...routesViewModel.copyLinkInfo} />
                    </div>

                    {/* Accordion para móvil/tablet */}
                    <div className="mobile-route-accordion">
                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    Información de la ruta
                                </Accordion.Header>

                                <Accordion.Body>
                                    <div className="accordion-content">

                                        <CountersGroup
                                            counters={[
                                                {
                                                    label: "Sumatoria total",
                                                    value: dayTotalAmount,
                                                    icon: 'moneySign',
                                                    color: 'colorsIcon',
                                                },
                                            ]}
                                        />

                                        <BalanceCountersGroup
                                            counters={[
                                                {
                                                    title: 'Saldo a favor',
                                                    favorSubtitle: 'Ruta',
                                                    favorBalance: routePayedAmount,
                                                    pendingSubtitle: 'Semana',
                                                    pendingBalance: weeklyPayedAmount,
                                                    icon: 'moneyBag',
                                                    color: 'colorsIcon',
                                                },
                                                {
                                                    title: 'Pendiente',
                                                    favorSubtitle: 'Ruta',
                                                    favorBalance: routePendingAmount,
                                                    pendingSubtitle: 'Semana',
                                                    pendingBalance: weeklyPendingAmount,
                                                    icon: 'warning',
                                                    color: 'colorsIcon',
                                                },
                                            ]}
                                        />

                                        <div className="actions-section">
                                            <Divider />

                                        <div className="buttons-section-container">
                                            <div className="disabled-tooltip-container">
                                                <ButtonActionAlert
                                                    onAction={routesViewModel.handleGenerateMessages}
                                                    successMessage="Mensajes generados exitosamente"
                                                    errorMessage="Revisa que las solicitudes estén completas y agrega un horario a cada una"
                                                    className="button-actions"
                                                    disabled={!isGoogleLoggedIn}
                                                >
                                                    Generar mensajes
                                                </ButtonActionAlert>

                                                    {!isGoogleLoggedIn && (
                                                        <span className="disabled-tooltip-text">
                                                            Requieres iniciar sesión por Google
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="disabled-tooltip-container">
                                                    <Button
                                                        size="medium"
                                                        csstype="accept"
                                                        className="button-actions"
                                                        onClick={routesViewModel.handleOpenRoutesSheet}
                                                        disabled={!isGoogleLoggedIn}
                                                    >
                                                        Resumen de ruta
                                                    </Button>

                                                    {!isGoogleLoggedIn && (
                                                        <span className="disabled-tooltip-text">
                                                            Requieres iniciar sesión por Google
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </div>

                {/* Layout normal escritorio */}
                <div className="route-header-row desktop-route-header">
                    <div className="route-counters-section">
                        <CountersGroup
                            counters={[
                                {
                                    label: "Sumatoria total",
                                    value: dayTotalAmount,
                                    icon: 'moneySign',
                                    color: 'colorsIcon',
                                },
                            ]}
                        />

                        <BalanceCountersGroup
                            counters={[
                                {
                                    title: 'Saldo a favor',
                                    favorSubtitle: 'Ruta',
                                    favorBalance: routePayedAmount,
                                    pendingSubtitle: 'Semana',
                                    pendingBalance: weeklyPayedAmount,
                                    icon: 'moneyBag',
                                    color: 'colorsIcon',
                                },
                            ]}
                        />

                        <BalanceCountersGroup
                            counters={[
                                {
                                    title: 'Pendiente',
                                    favorSubtitle: 'Ruta',
                                    favorBalance: routePendingAmount,
                                    pendingSubtitle: 'Semana',
                                    pendingBalance: weeklyPendingAmount,
                                    icon: 'warning',
                                    color: 'colorsIcon',
                                },
                            ]}
                        />

                        <Divider
                            className="min-height-100"
                        />

                        <div className="actions-section">
                            <div className="buttons-section-container">
                                <div className="disabled-tooltip-container">
                                    <ButtonActionAlert
                                        onAction={routesViewModel.handleGenerateMessages}
                                        successMessage="Mensajes generados exitosamente"
                                        errorMessage="Revisa que las solicitudes estén completas y agrega un horario a cada una"
                                        className="button-actions"
                                        disabled={!isGoogleLoggedIn}
                                    >
                                        Generar mensajes
                                    </ButtonActionAlert>

                                    {!isGoogleLoggedIn && (
                                        <span className="disabled-tooltip-text">
                                            Requieres iniciar sesión por Google
                                        </span>
                                    )}
                                </div>

                                <div className="disabled-tooltip-container">
                                    <Button
                                        size="medium"
                                        csstype="accept"
                                        className="button-actions"
                                        onClick={routesViewModel.handleOpenRoutesSheet}
                                        disabled={!isGoogleLoggedIn}
                                    >
                                        Resumen de ruta
                                    </Button>

                                    {!isGoogleLoggedIn && (
                                        <span className="disabled-tooltip-text">
                                            Requieres iniciar sesión por Google
                                        </span>
                                    )}
                                </div>
                            </div>
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