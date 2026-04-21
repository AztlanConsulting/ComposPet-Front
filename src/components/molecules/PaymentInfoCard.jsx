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
}) {
    return (
            <FormCard className="payment-info-card">
                <strong>
                    No olvides realizar tu pago.
                </strong>

                    <>
                        <p>
                            {text}
                        </p>

                        <p>
                            {notes}
                        </p>
                    </>
            
            </FormCard>
    );
}   