import { InventoryItem } from './index';

class Cart {
    public items: InventoryItem[];
    public capacity: number;
    public size: number;

    constructor(capacity: number) {
        this.capacity = capacity;
    }

    public getItems(): InventoryItem[] {
        return this.items;
    }
}

export { Cart };
