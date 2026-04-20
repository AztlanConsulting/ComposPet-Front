import React from 'react';

import FormCard from '../Template/formCard';
import SummaryProductCard from '../molecules/SummaryProductCard';


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
        <FormCard>
            <div className="third-form-grid">

                {/* DIV IZQUIERDA */}
                <section className="third-form-left">

                    <h2 className="third-form-title">
                        Formas de pago
                    </h2>

                    {/* MÉTODOS DE PAGO */}
                    <div className="third-form-payment-list">
                        {paymentMethods.map((method, index) => (
                            <p>{method.tipo}</p>
                        ))}
                    </div>

                    {/* INFO PAGO */}
                    <div className="third-form-info-box">

                        <div className="third-form-payment-info">
                            <h3>
                                No olvides realizar tu pago.
                            </h3>

                            {selectedMethod ? (
                                <>
                                    <p>
                                        {selectedMethod.texto}
                                    </p>

                                    <p>
                                        {selectedMethod.notas}
                                    </p>
                                </>
                            ) : (
                                <p>
                                    Selecciona una forma de pago
                                </p>
                            )}
                        </div>


                    </div>

                </section>

                {/* DIV DERECHA */}
                <section className="third-form-right">

                    <h2 className="third-form-title">
                        Resumen de compra
                    </h2>

                    <div className="third-form-products">
                        {products.map((product, index) => (
                            <SummaryProductCard
                            product={product.productos_extra}
                            cuantity={product.cantidad}
                            productTotal={product.cantidad * product.productos_extra.precio}
                            onDelete={() => removeProduct(product.id_producto, collection.id_solicitud)}
                            />
                        ))}
                    </div>

                    <p>Balance: {balance}</p>
                    <p>Total: {total}</p>

                </section>

            </div>
        </FormCard>
    );
}