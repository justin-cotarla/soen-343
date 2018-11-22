// @invariant({
//     this.capacity > 0,
//     this.items.size() <= this.capacity,
// })
class Cart {
    public items: string[];
    private capacity: number;
    private size: number;

    // @ensures({
    //    this.items !== null,
    //    this.capacity === 5,
    //    this.size >= 0
    // })
    constructor(cartItems?: string[]) {
        if (cartItems) {
            this.items = cartItems;
            this.size = cartItems.length;
        } else {
            this.items = [];
            this.size = 0;
        }
        this.capacity = 5;
    }

    // @ensures({
    //     this.items === @pre this.items,
    // })
    public getItems(): any {
        return this.items;
    }

    // @requires({
    //     newItems.length <= 5,
    // })
    // @ensures({
    //      this.items === newItems,
    //      this.size === newItems.length
    // })
    public update(newItems: string[]) {
        if (newItems.length > 5) {
            throw Error('Cart limit exceeded');
        }
        this.items = newItems;
        this.size = newItems.length;
    }
}

export { Cart };
