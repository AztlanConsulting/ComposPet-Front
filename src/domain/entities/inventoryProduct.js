export class InventoryProduct {
    constructor({
        productId,
        name,
        price,
        quantity,
        color,
        status,
    }) {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.color = color;
        this.status = status;
    }
}