import '../../css/molecules/balanceInfo.css';
import Icon from '../atoms/Icon';

/**
 * Muestra el saldo o adeudo actual del cliente.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.balanceTitle - Título del monto.
 * @param {string} props.formattedBalance - Monto formateado.
 * @param {"positive"|"warning"|"critical"} props.balanceStatus
 * Estado visual del monto.
 * @param {string} [props.warningMessage=""] - Mensaje de advertencia.
 * @returns {JSX.Element} Información del saldo o adeudo.
 */
export default function BalanceInfo({
    balanceTitle,
    formattedBalance,
    balanceStatus,
    warningMessage = '',
}) {
    return (
        <section className="balance-info">
            <div className="balance-info-main">
                <Icon
                    name="piggy"
                    className="balance-info-icon"
                />

                <div className="balance-info-content">
                    <h2 className="balance-info-title">
                        {balanceTitle}
                    </h2>

                    <p
                        className={
                            `balance-info-amount ` +
                            `balance-info-${balanceStatus}`
                        }
                    >
                        {formattedBalance}
                    </p>
                </div>
            </div>

            {warningMessage && (
                <p
                    className={
                        `balance-info-message ` +
                        `balance-info-${balanceStatus}`
                    }
                >
                    {warningMessage}
                </p>
            )}
        </section>
    );
}