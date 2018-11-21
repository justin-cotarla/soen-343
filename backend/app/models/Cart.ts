import { InventoryItem } from './index';
import { stringify } from 'querystring';

// @invariant({
//     this.capacity > 0,
//     this.items.size() <= this.capacity,
// })
class Cart {
    public items: Map<string, number>;
    public capacity: number = 5;

    // @ensures({
    //    this.items !== null,
    // })
    constructor() {
        this.items = new Map<string, number>();
    }

    // @ensures({
    //     this.items === @pre this.items,
    // })
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
