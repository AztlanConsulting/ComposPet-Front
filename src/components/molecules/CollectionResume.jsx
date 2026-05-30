import "../../css/molecules/collectionResume.css"
import FormCard from "../Template/formCard";
import SummaryProductCard from "./SummaryProductCard";

/**
 * Elemento con la lista de productos extra y su total
 *
 * @returns {JSX.Element} Tarjeta visual.
 */
export default function CollectionResume({
    products,
    removeProduct,
    balance,
    total,
    collection,
    className="",
}) {
    const getPaymentIcon = (tipo) => {
        if (tipo === "Saldo") return "piggy";
        if (tipo === "Transferencia") return "card";
        if (tipo === "Efectivo") return "bills";

    };

    const formatCurrency = (value) => {
        return `$${Number(value || 0).toFixed(2)}`;
    };

    return (
        <>
            <h2 className="resume-title">
                Resumen de compra
            </h2>

            {/* Lista de productos extra */}
            <div className="third-form-products">
                {products.map((product, index) => (
                    <SummaryProductCard
                    product={product.productos_extra}
                    cuantity={product.cantidad}
                    productTotal={product.cantidad * product.productos_extra.precio}
                    onDelete={() => removeProduct(product.id_producto, collection.id_solicitud, product.cantidad)}
                    />
                ))}
            </div>

            <div>
                {/* Totales de compra e info adicional */}
                <p className="balance-text">
                    Saldo: {formatCurrency(balance)}
                </p>

                <hr className="resume-divider" />

                <p className="total-text">
                    Total: {formatCurrency(total)}
                </p>
            </div>

        </>
    );
}   