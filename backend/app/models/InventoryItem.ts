import { CatalogItem } from './CatalogItem';

class InventoryItem {
    public id: number;
    public spec: CatalogItem;
    public available: boolean;

    constructor (
        id: number,
        spec: CatalogItem,
        available: boolean) {
        this.id = id;
        this.spec = spec;
        this.available = available;
    }
}
export { InventoryItem };
