import '../../../css/recolectionRequest/solicitudView.css';

import React from 'react';

import Button from '../../../components/atoms/Button';
import ProgressBarLogic from '../../../components/molecules/ProgressBarLogic';
import FirstFormRecolectionRequest from '../../../components/organisms/firstFormRecolectionRequest';

import useSolicitudViewModel from '../../viewmodels/solicitudes/solicitudViewModel';



/**
 * Vista de la primera sección del formulario de recolección.
 * Actualmente funciona con steps conectado al viewmodel `useSolicitudViewModel`
 * Primer step = organismo `FirstFormRecolectionRequest`
 *
 * Esta vista administra:
 * - la respuesta de si el cliente desea recolección;
 * - la respuesta de si el cliente desea productos extra;
 * - la cantidad de cubetas entregadas;
 * - la cantidad de cubetas recolectadas;
 * - los mensajes de error asociados a cada campo.
 *
 * @returns {JSX.Element} Vista inicial del formulario de recolección.
 */

export default function SolicitudView() {

    //Objeto temporal de errores por campo, para simular validación y mostrar mensajes asociados.
    const {
        currentStep,
        totalSteps,
        onNext,
        onBack,
        primeraSeccionVM
    } = useSolicitudViewModel();

    return (
        <main className="solicitud-view-background">
            <section className="solicitud-content">
                <h1 className="solicitud-title">
                    Formulario de recolección
                </h1>

                <div className="solicitud-progress">
                    <ProgressBarLogic currentStep={currentStep} totalSteps={totalSteps} />
                </div>

                {currentStep === 1 && (
                    <FirstFormRecolectionRequest
                        quiereRecoleccion={primeraSeccionVM.quiereRecoleccion}
                        setQuiereRecoleccion={primeraSeccionVM.setQuiereRecoleccion}

                        quiereProductosExtra={primeraSeccionVM.quiereProductosExtra}
                        setQuiereProductosExtra={primeraSeccionVM.setQuiereProductosExtra}

                        cubetasEntregadas={primeraSeccionVM.cubetasEntregadas}
                        setCubetasEntregadas={primeraSeccionVM.setCubetasEntregadas}

                        cubetasRecolectadas={primeraSeccionVM.cubetasRecolectadas}
                        setCubetasRecolectadas={primeraSeccionVM.setCubetasRecolectadas}

                        errors={primeraSeccionVM.errors}
                    />
                )}

                <div className="solicitud-actions">
                    <Button
                        type="button"
                        size="medium"
                        csstype="cancel"
                        className="solicitud-cancel-button"
                        onClick={onBack}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="button"
                        size="medium"
                        csstype="accept"
                        className="solicitud-next-button"
                        onClick={onNext}
                        disabled={primeraSeccionVM.loading}
                    >
                        {primeraSeccionVM.loading ? 'Guardando...' : 'Siguiente'}
                    </Button>
                </div>
            </section>
        </main>
    );
}