import { Cart, InventoryItem, Transaction } from '../models';
import Ledger from './Ledger';
import Catalog from './Catalog';

class TransactionService {
    carts: Map<string, Cart>;

    // @ensures({
    //    this.carts !== null,
    // })
    constructor() {
        this.carts = new Map<string, Cart>();
    }

    // @requires({
    //     this.carts.get(userId) !== null,
    // })
    // @ensures({
    //     cart.getItems() === @pre cart.getItems()
    // })
    async viewCart(userId: string) : Promise<InventoryItem[]> {
        const cart = this.carts.get(userId);
        if (cart === undefined) {
            throw Error(`No cart matching user id: ${userId}`);
        }

        return cart.getItems();
    }

    // @requires(
    //     this.carts.has(userId) === true
    // )
    // @ensures(
    //     this.carts.has(userId) === false,
    //     this.carts.size() === $old(this.carts.size()) - 1
    // )
    async cancelTransaction(userId: string) : Promise<boolean> {
        return this.carts.delete(userId);
    }

    async viewLoans(userId: string) : Promise<InventoryItem[]> {
        return Catalog.viewInventoryItems(null, userId);
    }

    // @ensures(
    //     this.carts.get(userId).items === items
    // )
    async updateCart(items: string[], userId: string) : Promise<Cart> {
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

    async viewTransactions(
            query: string,
            order: string,
            direction: string,
            timestamp: string,
            operation: string,
        ) : Promise<Transaction[]> {
        const convertedTimestamp = timestamp ? new Date(timestamp) : null;
        return await Ledger.viewTransactions(
            query,
            order,
            direction,
            convertedTimestamp,
            operation,
        );
    }
}

export default new TransactionService();
