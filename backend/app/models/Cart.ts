// @invariant({
//     this.capacity > 0,
//     this.items.size() <= this.capacity,
// })
class Cart {
    public items: string[];
    public capacity: number = 5;
    public size: number;

    // @ensures({
    //    this.items !== null,
    // })
    constructor(cartItems: string[]) {
        this.items = cartItems;
        this.size = cartItems.length;
    }

    // @ensures({
    //     this.items === @pre this.items,
    // })
    public getItems(): any {
        return this.items;
    }

    // @ensures({
    //      this.items = newItems
    // })
    public update(newItems: string[]) {
        this.items = newItems;
        this.size = newItems.length;
    }
}

export { Cart };
