import { Cart, InventoryItem, Transaction, Client } from '../models';
import { TransactionTDG } from '../persistence';
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


    async viewLoans(userId: string) : Promise<InventoryItem[]> {
        return Catalog.viewInventoryItems(null, userId);
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

    async viewTransactions(
            query: string,
            order: string,
            direction: string,
            timestamp: string,
            operation: string,
        ) : Promise<Transaction[]> {
        const convertedTimestamp = new Date(timestamp);
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
