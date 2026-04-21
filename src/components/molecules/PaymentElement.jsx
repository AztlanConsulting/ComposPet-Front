import "../../css/organisms/thirdFormRecolectionRequest.css"
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
}) {
    const getPaymentIcon = (tipo) => {
        if (tipo === "Saldo") return "piggy";
        if (tipo === "Transferencia") return "card";
        if (tipo === "Efectivo") return "bills";

    };
    return (
            <FormCard>
                <div className="third-form-grid">

                    {/* DIV IZQUIERDA (PAGO) */}
                    <section className="third-form-left">

                        <h2 className="third-form-title">
                            Formas de pago
                        </h2>

                        {/* MÉTODOS DE PAGO */}
                        <div className="third-form-payment-list">
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
                        
                        <div className="third-form-total">
                            <PaymentInfoCard
                                text={selectedMethod.texto}
                                notes={selectedMethod.notas}
                            />
                            <AdditionalNotes
                                notes={notes}
                                setNotes={setNotes}
                            />
                        </div>
                        


                    </section>

                </div>
            </FormCard>
    );
}   