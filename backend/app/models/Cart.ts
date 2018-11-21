// @invariant({
//     this.capacity > 0,
//     this.items.size() <= this.capacity,
// })
class Cart {
    public items: number[];
    private capacity: number = 5;

    // @ensures({
    //    this.items !== null,
    // })
    constructor() {
        this.items = [];
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
}

export { Cart };
