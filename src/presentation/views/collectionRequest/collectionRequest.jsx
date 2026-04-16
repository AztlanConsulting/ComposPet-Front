import '../../../css/collectionRequest/collectionRequestView.css';
import Button from '../../../components/atoms/Button';
import ProgressBarLogic from '../../../components/molecules/ProgressBarLogic';
import FirstFormRecolectionRequest from '../../../components/organisms/firstFormRecolectionRequest';
import SecondPageForm from '../../../components/organisms/secondPageForm';
import useCollectionRequestViewModel from '../../viewmodels/collectionRequest/collectionRequest';
import Navbar from '../../../components/molecules/Navbar';

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
    const {
        currentStep,
        totalSteps,
        onPrimaryAction,
        onSecondaryAction,
        primaryButtonText,
        secondaryButtonText,
        firstSectionViewModel,
        secondSectionViewModel,
    } = useCollectionRequestViewModel();

    return (
        <main className="collection-request-view-background">
            <Navbar />
            <section className="collection-request-content">
                <h1 className="collection-request-title">
                    Formulario de recolección
                </h1>

                <div className="collection-request-progress">
                    <ProgressBarLogic currentStep={currentStep} totalSteps={totalSteps} />
                </div>

                {currentStep === 1 && (
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
                    <SecondPageForm secondSectionViewModel={secondSectionViewModel} />
                )}

                {currentStep === 3 && (
                    <div>
                        <p>Contenido del Step 3</p>
                    </div>
                )}

                {currentStep === 4 && (
                    <div>
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
                        disabled={
                            currentStep === 1
                                ? firstSectionViewModel.loading
                                : currentStep === 2
                                    ? secondSectionViewModel.loading
                                    : false
                        }
                    >
                        {currentStep === 1 && firstSectionViewModel.loading
                            ? 'Guardando...'
                            : currentStep === 2 && secondSectionViewModel.loading
                                ? 'Guardando...'
                                : primaryButtonText}
                    </Button>
                </div>
            </section>
        </main>
    );
}