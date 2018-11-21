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
    // })
    constructor(cartItems: string[]) {
        this.items = cartItems;
        this.capacity = 5;
        this.size = cartItems.length;
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
    //      this.items = newItems
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
