import { Cart, InventoryItem } from '../models';

class TransactionService {
    carts: Map<string, Cart>;

    // @ensures({
    //    this.carts !== null,
    // })
    constructor() {
        this.carts = new Map<string, Cart>();
    }

    async viewCart(userId: string) : Promise<InventoryItem[]> {
        // @requires({
        //     this.carts.get(userId) !== null,
        // })
        // @ensures({
        //     cart.getItems() === @pre cart.getItems()
        // })
        const cart = this.carts.get(userId);
        if (cart === undefined) {
            throw Error(`No cart matching user id: ${userId}`);
        }

        return cart.getItems();

    }
}

export default new TransactionService();
