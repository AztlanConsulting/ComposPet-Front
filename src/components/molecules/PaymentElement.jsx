import "../../css/molecules/paymentElement.css"
import FormCard from "../Template/formCard";
import PaymentMethod from "./PaymentMethod";
import PaymentInfoCard from "./PaymentInfoCard";


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
                    <section className={`left-pay-section ${className}`}>
                        <h2 className="pay-title">
                            Forma de pago
                        </h2>

                        <div className="payment-list">
                            {paymentMethods.map((method, index) => (
                                <PaymentMethod
                                    key={method.id_pago}
                                    method={method}
                                    index={index}
                                    selectedPaymentIndex={selectedPaymentIndex}
                                    setSelectedPaymentIndex={setSelectedPaymentIndex}
                                    icon={getPaymentIcon(method.tipo)}
                                />
                            ))}
                        </div>

                        <PaymentInfoCard
                            className="payment-wrapper"
                            text={selectedMethod?.texto || ""}
                            notes={selectedMethod?.notas || ""}
                            paymentType={selectedMethod?.tipo || ""}
                        />
                    </section>
                </>
    );
}   