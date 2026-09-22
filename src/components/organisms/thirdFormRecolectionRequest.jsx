import React from 'react';

import FormCard from '../Template/formCard';
import "../../css/organisms/thirdFormRecolectionRequest.css";
import PaymentElement from '../molecules/PaymentElement';
import CollectionResume from '../molecules/CollectionResume';
import AdditionalNotes from '../molecules/AdditionalNotes';

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
    bucketCost,
    requiresPayment,
    isFreeService,
    loading,
    error,
    reloadSummary,
}) {
    const selectedMethod =
        selectedPaymentIndex !== null
            ? paymentMethods[selectedPaymentIndex]
            : null;

    const hasPaidExtraProducts = products.some(
        (product) =>
            product.cantidad > 0 &&
            product.productos_extra.precio > 0
    );

    if (error) {
        return (
            <div role="alert">
                <p>{error}</p>

                <button
                    type="button"
                    onClick={reloadSummary}
                >
                    Volver a cargar resumen
                </button>
            </div>
        );
    }

    if (loading || bucketCost == null) {
        return (
            <p role="status">
                Cargando resumen de compra...
            </p>
        );
    }

    return (
        <div className="third-form-wrapper">

            <FormCard className="payment-container">

                <div className="third-form-left-content">

                    <PaymentElement
                        paymentMethods={paymentMethods}
                        selectedMethod={selectedMethod}
                        selectedPaymentIndex={selectedPaymentIndex}
                        setSelectedPaymentIndex={setSelectedPaymentIndex}
                        className="payment-wrapper"
                        isFreeService={isFreeService}
                        hasPaidExtraProducts={hasPaidExtraProducts}
                    />

                    <section className="third-form-notes-section">

                        <h2 className="third-form-notes-title">
                            Notas adicionales
                        </h2>

                        <AdditionalNotes
                            notes={notes}
                            setNotes={setNotes}
                            className="notes-wrapper"
                        />

                        <p className="character-counter">
                            {notes?.length || 0}/500 caracteres
                        </p>

                    </section>
                </div>

            </FormCard>

            <FormCard className="third-form-right">

                <CollectionResume
                    products={products}
                    removeProduct={removeProduct}
                    balance={balance}
                    total={total}
                    collection={collection}
                    bucketCost={bucketCost}
                    paymentType={selectedMethod?.tipo}
                />

                <span className="balance-check">
                    {selectedMethod?.tipo === "Saldo" &&
                    Math.max(balance, 0) < total
                        ? "Tu saldo actual no cubre el total de tu compra, no olvides realizar un abono."
                        : null
                    }
                </span>

            </FormCard>

        </div>
    );
}