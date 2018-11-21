// @invariant({
//     this.capacity > 0,
//     this.items.size() <= this.capacity,
// })
class Cart {
    public items: number[];
    private capacity: number;

    // @ensures({
    //    this.items !== null,
    // })
    constructor(cartItems: number[]) {
        this.items = cartItems;
        this.capacity = 5;
    }

    // @ensures({
    //     this.items === @pre this.items,
    // })
    public getItems(): number[] {
        return this.items;
    }

    public size(): number {
        return this.items.length;
    }

    // @requires({
    //     newItems.length <= 5,
    // })
    // @ensures({
    //      this.items = newItems
    // })
    public update(newItems: number[]) {
        if (newItems.length > this.capacity) {
            throw Error('Cart limit exceeded');
        }
        this.items = newItems;
    }
}

export { Cart };
