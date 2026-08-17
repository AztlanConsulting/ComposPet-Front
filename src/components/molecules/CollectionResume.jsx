import "../../css/molecules/collectionResume.css"
import FormCard from "../Template/formCard";
import SummaryProductCard from "./SummaryProductCard";
import bucketCostMap from "../../presentation/viewmodels/utils/bucketCostMap";
import formatCurrency from '../../utilities/formatCurrency';

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
    paymentType,
    bucketCost,
    className="",
}) {
    const useBalance = paymentType === "Saldo";

    const balanceToDiscount = useBalance ? Math.abs(balance) : 0;
    const finalTotal = useBalance ? total - balanceToDiscount : total;

    const getPaymentIcon = (tipo) => {
        if (tipo === "Saldo") return "piggy";
        if (tipo === "Transferencia") return "card";
        if (tipo === "Efectivo") return "bills";

    };

    let productsAmount = 0;

    products.map((product, index) => {
        productsAmount += product.cantidad;
    });

    return (
        <>
            <h2 className="resume-title">
                Resumen de compra
            </h2>

            <div className="recoleccion-title">
                Recolección {collection.cubetas_recolectadas} cubeta
                {collection.cubetas_recolectadas === 1 ? "" : "s"}: {formatCurrency(bucketCost)}
            </div>
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
                <hr className="resume-divider" />
                <p className="balance-text">
                Subtotal {productsAmount} artículo{productsAmount === 1 ? "" : "s"}: {formatCurrency(total - bucketCost)}
                </p>

                {/* Totales de compra e info adicional */}
                <p className="balance-text">
                    Saldo: {formatCurrency(balance)}
                </p>

                <p className="total-text">
                    Total: {formatCurrency(total)}
                    {useBalance && (
                        <>
                            {" - "}
                            {formatCurrency(balanceToDiscount)}
                            {" = "}
                            {formatCurrency(finalTotal)}
                        </>
                    )}
                </p>
            </div>
        </>
    );
}