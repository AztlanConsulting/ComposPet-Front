import '../../../css/collectionRequest/collectionRequestView.css';

import React from 'react';

import Button from '../../../components/atoms/Button';
import ProgressBarLogic from '../../../components/molecules/ProgressBarLogic';
import FirstFormRecolectionRequest from '../../../components/organisms/firstFormRecolectionRequest';

import useCollectionRequestViewModel from '../../viewmodels/collectionRequest/collectionRequest';



/**
 * Vista de la primera sección del formulario de recolección.
 * Actualmente funciona con steps conectado al viewmodel `useCollectionRequestViewModel`
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

export default function CollectionRequestView() {

    //Objeto temporal de errores por campo, para simular validación y mostrar mensajes asociados.
    const {
        currentStep,
        totalSteps,
        onPrimaryAction,
        onSecondaryAction,
        primaryButtonText,
        secondaryButtonText,
        firstSectionViewModel,
    } = useCollectionRequestViewModel();

    return (
        <main className="collection-request-view-background">
            <section className="collection-request-content">
                <h1 className="collection-request-title">
                    Formulario de recolección
                </h1>

                <div className="collection-request-progress">
                    <ProgressBarLogic currentStep={currentStep} totalSteps={totalSteps} />
                </div>

                {currentStep === 1 && (

                    //Llama la vista del a primera parte de la sección
                    <FirstFormRecolectionRequest
                        wantsCollection={firstSectionViewModel.wantsCollection}
                        setWantsCollection={firstSectionViewModel.setWantsCollection}

                        wantsExtraProducts={firstSectionViewModel.wantsExtraProducts}
                        setWantsExtraProducts={firstSectionViewModel.setWantsExtraProducts}

                        deliveredBuckets={firstSectionViewModel.deliveredBuckets}
                        setDeliveredBuckets={firstSectionViewModel.setDeliveredBuckets}

                        collectedBuckets={firstSectionViewModel.collectedBuckets}
                        setCollectedBuckets={firstSectionViewModel.setCollectedBuckets}

                        errors={firstSectionViewModel.errors}
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


                <div className="collection-request-actions">
                    <Button
                        type="button"
                        size="medium"
                        csstype="cancel"
                        className="collection-request-cancel-button"
                        onClick={onSecondaryAction}
                    >
                        {secondaryButtonText}
                    </Button>

                    <Button
                        type="button"
                        size="medium"
                        csstype="accept"
                        className="collection-request-next-button"
                        onClick={onPrimaryAction}
                        disabled={firstSectionViewModel.loading}
                    >
                        {firstSectionViewModel.loading ? 'Guardando...' : primaryButtonText}
                    </Button>
                </div>
            </section>
        </main>
    );
}