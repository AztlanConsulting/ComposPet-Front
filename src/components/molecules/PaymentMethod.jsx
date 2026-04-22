import "../../css/molecules/PaymentMethod.css"
import Icon from "../atoms/Icon";

/**
 * Tarjeta de presentación del tipo de método de pago con su ícono.
 *
 * @returns {JSX.Element} Tarjeta visual con método de pago e ícono.
 */
export default function PaymentMethod({
    method,
    index,
    selectedPaymentIndex,
    setSelectedPaymentIndex,
    icon,

}) {
    return (
            <div
                key={method.id_pago}
                onClick={() => setSelectedPaymentIndex(index)}
                style={{ cursor: "pointer" }}
                className={`
                    d-flex
                    flex-column
                    justify-content-center
                    align-items-center
                    payment-card
                    ${selectedPaymentIndex === index ? "payment-card-selected" : ""}
                `}
            >       
                    <Icon name={icon} size="icon-large" className={selectedPaymentIndex == index ? "icon-selected" : ""} />
                    
                    <p className='payment-method'>{method.tipo}</p>

            </div>
    );
}   