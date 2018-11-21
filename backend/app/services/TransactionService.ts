import { Cart, InventoryItem, CatalogItem } from '../models';

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

    async cancelTransaction(userId: string) : Promise<boolean> {
        return this.carts.delete(userId);
    }

    async updateCart(items: string[], userId: string) : Promise<Cart> {
        // @ensures({
        //      cart.updateCart === items
        // })
        const result = this.carts.get(userId);
        let cart: Cart;

        if (!result) {
            cart = new Cart(items);
            this.carts.set(userId, cart);
            return cart;
        }

        cart = result;
        cart.update(items);
        return cart;
    }
}

export default new TransactionService();
