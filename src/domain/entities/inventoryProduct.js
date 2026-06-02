export class InventoryProduct {
    constructor({
        productId,
        name,
        price,
        description,
        quantity,
        color,
        status,
        imageUrl,
    }) {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.description = description;
        this.quantity = quantity;
        this.color = color;
        this.status = status;
        this.imageUrl = imageUrl;
    }
}