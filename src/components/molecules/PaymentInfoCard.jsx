import "../../css/molecules/paymentInfoCard.css"
import FormCard from "../Template/formCard";
import { useState } from "react";
import Icon from "../atoms/Icon";


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
}) {

    const [copied, setCopied] = useState(false);

    const formattedNotes = notes.replace(/\\n/g, "\n");

    const getAccountNumber = () => {
        const numbers = formattedNotes.match(/\d[\d\s]{5,}\d/g);

        if (!numbers) return "";

        return numbers[0].replace(/\s/g, "");
    };

    const handleCopyPaymentInfo = async () => {
        const accountNumber = getAccountNumber();

        if (!accountNumber) return;

        try {
            await navigator.clipboard.writeText(accountNumber);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch (error) {
            console.error("Error copying payment information:", error);
        }
    };

    const shouldShowCopyButton = paymentType === "Transferencia";


    return (
        <FormCard className={`payment-info-card ${className}`}>
            <strong className="payment-info-reminder">
                No olvides realizar tu pago.
            </strong>

            <strong className="payment-info-title">
                {text}
            </strong>

            <strong className="notes-info">
                {formattedNotes}
            </strong>

            {shouldShowCopyButton && (
                <div className="payment-copy-wrapper">
                    {copied && (
                        <span className="payment-copy-bubble">
                            ¡Copiado!
                        </span>
                    )}

                    <button
                        type="button"
                        className="payment-copy-button"
                        onClick={handleCopyPaymentInfo}
                    >
                        <span>Copiar</span>
                        <Icon name="copy" size="medium" color="secondary" />
                    </button>
                </div>
            )}
        </FormCard>
    );
}