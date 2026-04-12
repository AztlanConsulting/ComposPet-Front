import React, { useState } from 'react';
import FirstFormRecolectionRequest from '../../../components/organisms/firstFormRecolectionRequest';
import Button from '../../../components/atoms/Button';
import '../../../css/recolectionRequest/solicitudView.css';
import ProgressBarLogic from '../../../components/molecules/ProgressBarLogic';

/**
 * Vista de la primera sección del formulario de recolección.
 * Actualmente funciona como una versión inicial de integración visual
 * del organismo `FirstFormRecolectionRequest`, utilizando estado local
 * para simular el comportamiento del formulario antes de conectarlo
 * al ViewModel y a la lógica completa del flujo.
 *
 * Esta vista administra temporalmente:
 * - la respuesta de si el cliente desea recolección;
 * - la respuesta de si el cliente desea productos extra;
 * - la cantidad de cubetas entregadas;
 * - la cantidad de cubetas recolectadas;
 * - los mensajes de error asociados a cada campo.
 *
 * @returns {JSX.Element} Vista inicial del formulario de recolección.
 */

export default function SolicitudView() {
    //Estado temporal para indicar si el cliente desea recolección.
    const [quiereRecoleccion, setQuiereRecoleccion] = useState(true);

    //Estado temporal para indicar si el cliente desea productos extra.
    const [quiereProductosExtra, setQuiereProductosExtra] = useState(false);

     //Estado temporal para la cantidad de cubetas vacías que serán entregadas al cliente.
    const [cubetasEntregadas, setCubetasEntregadas] = useState(5);

    
    //Estado temporal para la cantidad de cubetas que serán recolectadas del cliente.
    const [cubetasRecolectadas, setCubetasRecolectadas] = useState(5);

    //Objeto temporal de errores por campo, para simular validación y mostrar mensajes asociados.
    const errors = {
        quiereRecoleccion: '',
        quiereProductosExtra: '',
        cubetasEntregadas: '',
        cubetasRecolectadas: '',
    };

    return (
        <main className="solicitud-view-background">
            <section className="solicitud-content">
                <h1 className="solicitud-title">
                    Formulario de recolección
                </h1>

                <div className="solicitud-progress">
                    <ProgressBarLogic currentStep={1} totalSteps={5} />
                </div>


                <FirstFormRecolectionRequest
                    quiereRecoleccion={quiereRecoleccion}
                    setQuiereRecoleccion={setQuiereRecoleccion}

                    quiereProductosExtra={quiereProductosExtra}
                    setQuiereProductosExtra={setQuiereProductosExtra}

                    cubetasEntregadas={cubetasEntregadas}
                    setCubetasEntregadas={setCubetasEntregadas}

                    cubetasRecolectadas={cubetasRecolectadas}
                    setCubetasRecolectadas={setCubetasRecolectadas}

                    errors={errors}
                />

                <div className="solicitud-actions">
                    <Button
                        type="button"
                        size="medium"
                        csstype="cancel"
                        className="solicitud-cancel-button"
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="button"
                        size="medium"
                        csstype="accept"
                        className="solicitud-next-button"
                    >
                        Siguiente
                    </Button>

                </div>
            </section>
        </main>
    );
}