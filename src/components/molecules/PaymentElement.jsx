import "../../css/molecules/paymentElement.css";

import PaymentMethod from "./PaymentMethod";
import PaymentInfoCard from "./PaymentInfoCard";

/**
 * Elemento con los métodos de pago y la información
 * del método seleccionado.
 *
 * @returns {JSX.Element} Sección de formas de pago.
 */
export default function PaymentElement({
    paymentMethods,
    selectedMethod,
    selectedPaymentIndex,
    setSelectedPaymentIndex,
    isFreeService = false,
    hasPaidExtraProducts = false,
    className = "",
}) {
    const getPaymentIcon = (tipo) => {
        if (tipo === "Saldo") return "piggy";
        if (tipo === "Transferencia") return "card";
        if (tipo === "Efectivo") return "bills";

        return "";
    };

    const reminderText = isFreeService
        ? hasPaidExtraProducts
            ? "Tu servicio de recolección es gratis. Solo recuerda realizar el pago de tus productos extra."
            : "Tu servicio de recolección es gratis."
        : "No olvides realizar tu pago.";

    return (
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
                reminderText={reminderText}
                text={selectedMethod?.texto || ""}
                notes={selectedMethod?.notas || ""}
                paymentType={selectedMethod?.tipo || ""}
                isFreeService={isFreeService}
            />
        </section>
    );
}