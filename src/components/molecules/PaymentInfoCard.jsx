import "../../css/molecules/paymentInfoCard.css"
import FormCard from "../Template/formCard";

/**
 * Tarjeta de presentación de la información del método de pago.
 * Muestra el texto y las notas del método de pago seleccionado.
 *
 * @returns {JSX.Element} Tarjeta visual del texto y notas del método de pago.
 */
export default function PaymentInfoCard({
    text = "",
    notes = "",
    className = "",
}) {
    return (
            <FormCard className={`
                payment-info-card
                ${className}
            `}
            >
                <strong>
                    No olvides realizar tu pago.
                </strong>
                <br />
                    <>
                        <strong>
                            {text}
                        </strong>

                        <strong className="notes-info">
                            {notes.replace(/\\n/g, '\n')}
                        </strong>
                    </>
            
            </FormCard>
    );
}   