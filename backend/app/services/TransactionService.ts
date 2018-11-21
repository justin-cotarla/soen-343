import Ledger from './Ledger';
import TransactionTDG  from '../persistence/TransactionTDG';
import { Cart, Transaction } from '../models';

class TransactionService {
    public carts: Map<string, Cart>;

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
    async viewCart(userId: string) : Promise<number[]> {
        const cart = this.carts.get(userId);
        if (cart === undefined) {
            throw Error(`No cart matching user id: ${userId}`);
        }

        return cart.getItems();
    }

    async updateCart(items: number[], userId: string) : Promise<Cart> {
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

    // @requires({ this.carts.get(userId) !== undefined })
    // @ensures({ this.carts.get(userId) === undefined })
    async cancelTransaction(userId: string) : Promise<boolean> {
        return this.carts.delete(userId);
    }

    // @requires({
    //     this.carts.get(userId) !== undefined,
    //     this.carts.get(userId).size() > 0,
    // })
    // @ensures({
    //     this.carts.get(userId) === undefined,
    //
    async borrowItems(userId: string): Promise<void> {
        const j = new Cart([1, 1, 2, 1]);
        this.carts.set('16', j);
        const cart = this.carts.get(userId.toString());

        if (cart === undefined) {
            throw Error(`No cart matching user id: ${userId}`);
        }

        if (cart.size() === 0) {
            throw Error('Cart is empty');
        }

        try {
            await TransactionTDG.processLoan(userId, cart);
            this.carts.delete(userId.toString());
        } catch (error) {
            throw error;
        }

    }

    async returnItem(userId: string, inventoryItemId: number): Promise<void> {
        try {
            await TransactionTDG.processReturn(userId, inventoryItemId);
        } catch (error) {
            throw error;
        }
    }
}

export default new TransactionService();
