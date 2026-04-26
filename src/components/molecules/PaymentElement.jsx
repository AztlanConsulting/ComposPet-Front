import "../../css/molecules/paymentElement.css"
import FormCard from "../Template/formCard";
import PaymentMethod from "./PaymentMethod";
import PaymentInfoCard from "./PaymentInfoCard";
import AdditionalNotes from "./AdditionalNotes";

/**
 * Elemento con los cards de formas de pago, información adicional y notas.
 *
 * @returns {JSX.Element} Tarjeta visual.
 */
export default function PaymentElement({
    paymentMethods,
    selectedMethod,
    selectedPaymentIndex,
    setSelectedPaymentIndex,
    notes,
    setNotes,
    className="",
}) {
    const getPaymentIcon = (tipo) => {
        if (tipo === "Saldo") return "piggy";
        if (tipo === "Transferencia") return "card";
        if (tipo === "Efectivo") return "bills";

    };
    return (
                <>
                    {/* DIV IZQUIERDA (PAGO) */}
                    <section className="left-pay-section">

                        <h2 className="pay-title">
                            Formas de pago
                        </h2>

                        {/* MÉTODOS DE PAGO */}
                        <div className="payment-list">
                            {paymentMethods.map((method, index) => (
                            <PaymentMethod
                                method={method}
                                index={index}
                                selectedPaymentIndex={selectedPaymentIndex}
                                setSelectedPaymentIndex={setSelectedPaymentIndex}
                                icon={getPaymentIcon(method.tipo)}
                            />

                                
                            ))}
                        </div>
                        
                        <div className="bottom-info">
                            <PaymentInfoCard
                            className='payment-wrapper'
                                text={selectedMethod.texto}
                                notes={selectedMethod.notas}
                            />
                            <AdditionalNotes
                            className='notes-wrapper'
                                notes={notes}
                                setNotes={setNotes}
                            />
                        </div>
                        
                    </section>
                </>
    );
}   