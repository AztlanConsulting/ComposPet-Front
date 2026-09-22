import "../../css/molecules/collectionResume.css"
import SummaryProductCard from "./SummaryProductCard";
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
}) {
    /*const useBalance = paymentType === "Saldo";

    const balanceToDiscount = useBalance ? Math.abs(balance) : 0;
    const finalTotal = useBalance ? total - balanceToDiscount : total;*/

    const useBalance = paymentType === "Saldo";

    const availableBalance = Math.max(balance, 0);

    const balanceToDiscount = useBalance
        ? Math.min(availableBalance, total)
        : 0;

    const finalTotal = total - balanceToDiscount;

    const productsAmount = products.reduce((amount, product) => amount + product.cantidad, 0);
    const productsSubtotal = products.reduce(
        (subtotal, product) => subtotal + product.cantidad * product.productos_extra.precio, 0
    );

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
                {products.map((product) => (
                    <SummaryProductCard
                    key={product.id_producto}
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
                Subtotal {productsAmount} artículo{productsAmount === 1 ? "" : "s"}: {formatCurrency(productsSubtotal)}
                </p>

                {/* Totales de compra e info adicional */}
                <p className="balance-text">
                    Saldo: {formatCurrency(balance)}
                </p>

                <p className="total-text">
                    Total: {formatCurrency(total)}
                    {useBalance && balanceToDiscount > 0 && (
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
