import Ledger from './Ledger';
import Catalog from './Catalog';
import TransactionDAO  from '../persistence/TransactionDAO';
import { Cart, Transaction, InventoryItem } from '../models';

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
        const convertedTimestamp = timestamp ? new Date(timestamp) : null;
        return await Ledger.viewTransactions(
            query,
            order,
            direction,
            convertedTimestamp,
            operation,
        );
    }

    // @requires({
    //     this.carts.get(userId) !== undefined,
    //     this.carts.get(userId).size() > 0,
    //     this.carts.get(userId).getItems() -> excludes(item | item.type !== 'magazine')
    // })
    // @ensures({
    //     this.carts.get(userId) === undefined,
    //
    async borrowItems(userId: string): Promise<void> {
        const cart = this.carts.get(userId.toString());

        // User's cart must exist
        if (cart === undefined) {
            throw Error(`No cart matching user id: ${userId}`);
        }

        // Cart cannot be empty
        if (cart.size() === 0) {
            throw Error('Cart is empty');
        }

        // User cannot have more than 5 total items on loan
        let itemsOnLoan: InventoryItem[];
        try {
            itemsOnLoan = await this.viewLoans(userId);
        } catch (error) {
            throw error;
        }

        if (itemsOnLoan.length + cart.size() > 5) {
            throw Error('Cannot have more than 5 items on loan');
        }

        // get type of item to determine due date later
        let cartItems: any[] = cart.getItems();
        cartItems = cartItems.map(async (catalogItemId: any) => {
            const catalogItem = await Catalog.viewItem(catalogItemId);
            return {
                catalogItemId,
                catalogItemType: catalogItem.constructor.name.toLowerCase(),
            };
        });

        cartItems = await Promise.all(cartItems);

        // Magazines cannot be loaned out
        if (cartItems.filter(item => item.catalagItemType === 'magazine').length > 0) {
            throw Error('Magazines cannot be loaned out');
        }

        try {
            await TransactionDAO.processLoan(userId, cartItems);
            this.carts.delete(userId.toString());
        } catch (error) {
            throw error;
        }

    }

    async returnItem(userId: string, inventoryItemId: number): Promise<void> {
        try {
            await TransactionDAO.processReturn(userId, inventoryItemId);
        } catch (error) {
            throw error;
        }
    }
}

export default new TransactionService();
