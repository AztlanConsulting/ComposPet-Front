import '../../../css/recolectionRequest/solicitudView.css';

import React from 'react';

import Button from '../../../components/atoms/Button';
import ProgressBarLogic from '../../../components/molecules/ProgressBarLogic';
import FirstFormRecolectionRequest from '../../../components/organisms/firstFormRecolectionRequest';
import NavBar from '../../../components/molecules/Navbar';
import useSolicitudViewModel from '../../viewmodels/solicitudes/solicitudViewModel';
import SecondPageForm from '../../../components/organisms/extraProductsPageForm';



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
        onPrimaryAction,
        onSecondaryAction,
        primaryButtonText,
        secondaryButtonText,
        primeraSeccionVM
    } = useSolicitudViewModel();

    return (
        <main className="solicitud-view-background">
            <NavBar />
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

                {currentStep === 2 && (
                    <div>
                        {/* Aquí irá la lógica del step 2, 3, 4... */}
                        <p>Contenido del Step 2</p>
                    </div>
                )}

                {currentStep === 3 && (
                    <div>
                        {/* Aquí irá la lógica del step 2, 3, 4... */}
                        <p>Contenido del Step 3</p>
                    </div>
                )}

                {currentStep === 4 && (
                    <div>
                        {/* Aquí irá la lógica del step 2, 3, 4... */}
                        <p>Contenido del Step 4</p>
                    </div>
                )}


                <div className="solicitud-actions">
                    <Button
                        type="button"
                        size="medium"
                        csstype="cancel"
                        className="solicitud-cancel-button"
                        onClick={onSecondaryAction}
                    >
                        {secondaryButtonText}
                    </Button>

                    <Button
                        type="button"
                        size="medium"
                        csstype="accept"
                        className="solicitud-next-button"
                        onClick={onPrimaryAction}
                        disabled={primeraSeccionVM.loading}
                    >
                        {primeraSeccionVM.loading ? 'Guardando...' : primaryButtonText}
                    </Button>
                </div>
            </section>
        </main>
    );
}