import { Cart } from '../models';

class TransactionService {
    carts: Map<string, Cart>;

    constructor() {
        this.carts = new Map<string, Cart>();
    }

    async viewCart(userId: string) : Promise<Cart> {
        // precondition(s):
        //     - a cart corresponding to the userId exists
        // postcondition(s):
        //     - the cart corresponding to the userId is returned
        //     - cart.getItems() === @precart.getItems()

        const cart = this.carts.get(userId);
        if (cart === undefined) {
            throw Error(`No cart matching user id: ${userId}`);
        }

        return cart;

    }
}

export default new TransactionService();
