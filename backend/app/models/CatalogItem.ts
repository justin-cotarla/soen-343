import { InventoryItem } from './InventoryItem';

abstract class CatalogItem {
    public id: number;
    public title: string;
    public date: string;
    private inventory : InventoryItem[];

    constructor (
        id: number,
        title: string,
        date: string,
        inventory : InventoryItem[]) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.inventory = inventory;
    }

    public addInventoryItem(item: InventoryItem) {
    }

    public removeInventoryItem(item: InventoryItem) {
    }

}
export { CatalogItem };
