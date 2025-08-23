import { Product } from "./product";

export class CartItem {

    public id: string;
    public name:string;
    public unitPrice:number;
    public imageUrl:string;

    public quantity: number;

    constructor(product: Product
            
    ) {

        this.id = product.id;
        this.name = product.name;
        this.unitPrice = product.unitPrice;
        this.imageUrl = product.imageUrl;
        this.quantity = 1;
    }
}
