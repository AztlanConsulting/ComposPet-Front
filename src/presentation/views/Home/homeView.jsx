import '../../../css/home/homeView.css';
import { useHomeViewModel } from '../../viewmodels/home/homeViewModel';
import Navbar from '../../../components/molecules/Navbar';
import PaymentInfoCard from '../../../components/molecules/PaymentInfoCard';
import BalanceInfo from '../../../components/molecules/BalanceInfo';
import Icon from '../../../components/atoms/Icon';
import Button from '../../../components/atoms/Button';
import Loading from '../../../components/Template/loading';
import Error from '../../../components/Template/error';



export default function HomeView() {

    const {
        welcomeName,
        balanceTitle,
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
                <section className="home-view-welcome-section">
                    <h1 className="home-view-welcome-title">
                        ¡Bienvenido {welcomeName} a ComposPage!
                    </h1>

                    <p className="home-view-welcome-subtitle">
                        Gracias por ser parte de nuestra comunidad
                    </p>
                </section>

                <div className="home-view-service-content">
                    <div className="home-view-main-info">
                        <BalanceInfo
                            balanceTitle={balanceTitle}
                            formattedBalance={formattedBalance}
                            balanceStatus={balanceStatus}
                            warningMessage={warningMessage}
                        />

                    <PaymentInfoCard
                        className="home-view-payment-card"
                        text={paymentInfo.text}
                        notes={paymentInfo.notes}
                        paymentType={paymentInfo.paymentType}
                        showReminder={false}
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
                </div>

                <div className="home-view-instagram-section">
                    <span className="home-view-instagram-text">
                        Únete a nuestra comunidad:
                    </span>

                    <a
                        className="home-view-instagram-link"
                        href="https://www.instagram.com/compospet.qro/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visitar Instagram de ComposPet"
                    >
                        <Icon
                            name="instagram"
                            className="home-view-instagram-icon"
                        />

                        <span className="home-view-instagram-user">
                            @compospet.qro
                        </span>
                    </a>
                </div>

            </section>
        </main>
    );
}