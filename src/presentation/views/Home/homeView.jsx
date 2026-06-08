import '../../../css/home/homeView.css';
import { useHomeViewModel } from '../../viewmodels/home/homeViewModel';
import Navbar from '../../../components/molecules/Navbar';
import PaymentInfoCard from '../../../components/molecules/PaymentInfoCard';
import Icon from '../../../components/atoms/Icon';
import Button from '../../../components/atoms/Button';
import Loading from '../../../components/Template/loading';
import Error from '../../../components/Template/error';



export default function HomeView() {

    const {
        formattedBalance,
        balanceStatus,
        warningMessage,
        paymentInfo,
        loading,
        error,
        goToCollectionForm,
    } = useHomeViewModel();

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <Error message={error} />;
    }

    return (
        <main className="home-view-background">
            <Navbar />
            <section className="home-view-content">
                <div className="home-view-main-info">
                    <section className="home-view-balance-section">
                        <Icon
                            name="piggy"
                            className="home-view-pig-icon"
                        />

                        <div className="home-view-balance-info">
                            <h1 className="home-view-balance-title">
                                Mi saldo
                            </h1>

                            <p className={`home-view-balance-amount home-view-balance-${balanceStatus}`}>
                                {formattedBalance}
                            </p>

                            {warningMessage && (
                                <p className={`home-view-warning-message home-view-balance-${balanceStatus}`}>
                                    {warningMessage}
                                </p>
                            )}
                        </div>
                    </section>

                    <PaymentInfoCard
                        text={paymentInfo.text}
                        notes={paymentInfo.notes}
                        paymentType={paymentInfo.paymentType}
                        className="home-view-payment-card"
                    />
                </div>

                <Button
                    type="button"
                    size="extra-lg"
                    csstype="accept"
                    className="home-view-collection-button"
                    onClick={goToCollectionForm}
                >
                    Formulario de recolección
                </Button>
            </section>
        </main>
    );
}