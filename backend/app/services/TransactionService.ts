import { Cart, InventoryItem, Transaction, Client } from '../models';
import { TransactionTDG } from '../persistence';
import Ledger from './Ledger';

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
