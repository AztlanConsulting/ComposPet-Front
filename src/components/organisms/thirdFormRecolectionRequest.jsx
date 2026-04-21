import React from 'react';

import FormCard from '../Template/formCard';
import "../../css/organisms/thirdFormRecolectionRequest.css"
import PaymentElement from '../molecules/PaymentElement';
import CollectionResume from '../molecules/CollectionResume';
/**
 * Organismo de la tercera sección:
 * - Formas de pago
 * - Datos dinámicos del método seleccionado
 * - Notas adicionales
 * - Resumen de compra
 *
 * @param {Object[]} paymentMethods
 * @param {boolean[]} paymentAviable
 * @param {number|null} selectedPaymentIndex
 * @param {Function} setSelectedPaymentIndex
 *
 * @param {Object[]} products
 *
 * @param {string} notes
 * @param {Function} setNotes
 *
 * @param {number} balance

 * @param {number} total
 * 
 * @param {function} removeProduct
 */

export default function ThirdFormCollectionRequest({
    collection,
    paymentMethods,
    paymentAviable,
    selectedPaymentIndex,
    setSelectedPaymentIndex,

    products,

    notes,
    setNotes,

    balance,
    total,

    removeProduct,
}) {
    const selectedMethod =
        selectedPaymentIndex !== null
            ? paymentMethods[selectedPaymentIndex]
            : null;

    return (
        <div className="third-form-total">
            <PaymentElement
                paymentMethods={paymentMethods}
                selectedMethod={selectedMethod}
                selectedPaymentIndex={selectedPaymentIndex}
                setSelectedPaymentIndex={setSelectedPaymentIndex}
                notes={notes}
                setNotes={setNotes}
            />

            {/* DIV DERECHA (Resumen de compra) */}
            <FormCard className="third-form-right">

                <CollectionResume
                    products={products}
                    removeProduct={removeProduct}
                    balance={balance}
                    total={total}
                    collection={collection}
                />

                    <span>{balance < total ? "Tu saldo actual no cubre el total de tu compra, no olvides realizar un abono." : null}</span>
            </FormCard>
        </div>
    );
}