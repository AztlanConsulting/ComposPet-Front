import '../../../css/collectionRequest/collectionRequestView.css';
import Button from '../../../components/atoms/Button';
import ProgressBarLogic from '../../../components/molecules/ProgressBarLogic';
import FirstFormRecolectionRequest from '../../../components/organisms/firstFormRecolectionRequest';
import ThirdFormCollectionRequest from '../../../components/organisms/thirdFormRecolectionRequest';
import SecondPageForm from '../../../components/organisms/secondPageForm';
import useCollectionRequestViewModel from '../../viewmodels/collectionRequest/collectionRequest';
import Navbar from '../../../components/molecules/Navbar';
import Loading from '../../../components/Template/loading';
import Error from '../../../components/Template/error';


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
        progressSteps,
        onPrimaryAction,
        cancelForm,
        goToPreviousStep,
        primaryButtonText,
        firstSectionViewModel,
        thirdSectionViewModel,
        secondSectionViewModel,
        loading,
        error,
    } = useCollectionRequestViewModel();


    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <Error message={error} />;
    }

    return (
        <main className="collection-request-view-background">
            <Navbar />
            <section className="collection-request-content">
                <h1 className="collection-request-title">
                    Formulario de recolección
                </h1>

                <div className="collection-request-progress">
                    <ProgressBarLogic 
                        currentStep={currentStep}
                        steps={progressSteps}
                        onStepClick={goToPreviousStep}
                    />
                </div>

                {currentStep === 1 && (

                    //Llama la vista del a primera parte de la sección
                    <FirstFormRecolectionRequest
                        wantsCollection={firstSectionViewModel.wantsCollection}
                        setWantsCollection={firstSectionViewModel.setWantsCollection}

                        wantsExtraProducts={firstSectionViewModel.wantsExtraProducts}
                        setWantsExtraProducts={firstSectionViewModel.setWantsExtraProducts}

                        deliveredBuckets={firstSectionViewModel.deliveredBuckets}
                        handleDeliveredBucketsChange={firstSectionViewModel.handleDeliveredBucketsChange}
                        incrementDeliveredBuckets={firstSectionViewModel.incrementDeliveredBuckets}
                        decrementDeliveredBuckets={firstSectionViewModel.decrementDeliveredBuckets}

                        collectedBuckets={firstSectionViewModel.collectedBuckets}
                        handleCollectedBucketsChange={firstSectionViewModel.handleCollectedBucketsChange}
                        incrementCollectedBuckets={firstSectionViewModel.incrementCollectedBuckets}
                        decrementCollectedBuckets={firstSectionViewModel.decrementCollectedBuckets}

                        errors={firstSectionViewModel.errors}
                        loadError={firstSectionViewModel.loadError}
                    />
                )}

                {currentStep === 2 && (
                    <SecondPageForm secondSectionViewModel={secondSectionViewModel} />
                )}

                {currentStep === 3 && (
                    <ThirdFormCollectionRequest
                        paymentMethods={thirdSectionViewModel.paymentMethods}
                        paymentAviable={thirdSectionViewModel.paymentAviable}
                        selectedPaymentIndex={thirdSectionViewModel.selectedPaymentIndex}
                        setSelectedPaymentIndex={thirdSectionViewModel.setSelectedPaymentIndex}
                        products={thirdSectionViewModel.products}
                        notes={thirdSectionViewModel.notes}
                        setNotes={thirdSectionViewModel.setNotes}
                        balance={thirdSectionViewModel.balance}
                        total={thirdSectionViewModel.collectionTotal}
                        removeProduct={thirdSectionViewModel.removeProduct}
                        collection={thirdSectionViewModel.collection}
                    />
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
                            className="collection-request-cancel-page2-button"
                            onClick={cancelForm}
                        >
                            Cancelar
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