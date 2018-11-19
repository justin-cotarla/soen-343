import { CatalogItem } from './CatalogItem';

class InventoryItem {
    public id: string;
    public catalogItemId: string;
    public loanedTo: string;
    public dueDate: string;

    constructor (
        id: string,
        catalogItemId: string,
        loanedTo: string,
        dueDate: string,
    ) {
        this.id = id;
        this.catalogItemId = catalogItemId,
        this.loanedTo = loanedTo;
        this.dueDate = dueDate;
    }
}
export { InventoryItem };
