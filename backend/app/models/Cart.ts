import { InventoryItem } from './index';
import { stringify } from 'querystring';

class Cart {
    public items: Map<string, number>;
    public capacity: number;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.items = new Map<string, number>();
    }

    public getItems(): any {
        let cart: any = [];
        this.items.forEach((quantity, catalogItemId) => {
            cart = cart.concat({
                catalogItemId,
                quantity,
            });
        });

        return cart;
    }
}

export { Cart };
