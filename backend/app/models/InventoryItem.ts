import { CatalogItem } from './CatalogItem';

class InventoryItem {
    public id: string;
    public catalogItemId: string;
    public available: boolean;

    constructor (
        id: string,
        catalogItemId: string,
        available: boolean) {
        this.id = id;
        this.catalogItemId = catalogItemId,
        this.available = available;
    }
}
export { InventoryItem };
