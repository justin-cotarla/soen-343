import { InventoryItem } from './InventoryItem';

abstract class CatalogItem {
    public id: number;
    public title: string;
    public date: string;
    private copies : InventoryItem[];

    constructor (
        id: number,
        title: string,
        date: string) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.copies = [];
    }

    public get(id: number): InventoryItem {
        return this.copies.find(i => i.id === id);
    }

    public add(item: InventoryItem) {
        this.copies.push(item);
    }

    public remove(id: number): boolean {
        const index = this.copies.findIndex(i => i.id === id);
        if (index === -1) {
            return false;
        }
        this.copies.splice(index, 1);
        return true;
    }

}
export { CatalogItem };
