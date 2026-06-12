import "../../css/molecules/paymentInfoCard.css"
import FormCard from "../Template/formCard";
import CopyLink from "../molecules/CopyLink";

/**
 * Tarjeta de presentación de la información del método de pago.
 * Muestra el texto y las notas del método de pago seleccionado.
 *
 * @returns {JSX.Element} Tarjeta visual del texto y notas del método de pago.
 */
export default function PaymentInfoCard({
    text = "",
    notes = "",
    paymentType = "",
    className = "",
    showReminder = true,
}) {

    const formattedNotes = notes.replace(/\\n/g, "\n");

    const getAccountNumber = () => {
        const numbers = formattedNotes.match(/\d[\d\s]{5,}\d/g);

        if (!numbers) return "";

        return numbers[0].replace(/\s/g, "");
    };

    const shouldShowCopyButton = paymentType === "Transferencia";

    return (
        <FormCard className={`payment-info-card ${className}`}>
            {showReminder && (
                <strong className="payment-info-reminder">
                    No olvides realizar tu pago.
                </strong>
            )}

            <strong className="payment-info-title">
                {text}
            </strong>

            <strong className="notes-info">
                {formattedNotes}
            </strong>

            {shouldShowCopyButton && (
                <div className="payment-copy-wrapper">
                    <CopyLink
                        link={getAccountNumber()}
                        text="Copiar"
                        bubbleMessage="¡Copiado!"
                    />
                </div>
            )}
        </FormCard>
    );
}