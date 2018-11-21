import { Cart, InventoryItem, User } from '../models';
import UserService from './UserService';
import Catalog from './Catalog';
import Ledger from './Ledger';
import InventoryTDG from '../persistence/InventoryTDG';
import { OperationType } from '../models/Transaction';
import TransactionTDG  from '../persistence/TransactionTDG';

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
        const j = new Cart();
        j.items = [1, 1, 2, 1];
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
