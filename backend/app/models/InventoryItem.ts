import { CatalogItem } from './CatalogItem';

class InventoryItem {
    public id: string;
    public spec: CatalogItem;
    public available: boolean;

    constructor (
        id: string,
        spec: CatalogItem,
        available: boolean) {
        this.id = id;
        this.spec = spec;
        this.available = available;
    }
}
export { InventoryItem };
