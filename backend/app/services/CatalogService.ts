import v4 from 'uuid/v4';
import { Request, Response } from 'express';
import { CatalogItem, InventoryItem } from '../models';

class CatalogService {
    private catalogItems: Map<CatalogItem, InventoryItem[]> = new Map();

    viewCatalogItems = async () : Promise<CatalogItem[]> => {
        return await Array.from(this.catalogItems.entries())
                .reduce((o, [catalogItem, inventory]) => {
                    const res = {
                        catalogItem,
                        inventory,
                    };
                    o.push(res);
                    return o;
                },      []);
    }

    async updateCatalog(catalogItemId: string) {

    }

    addCatalogItem = async (record: CatalogItem, quantity: number) : Promise<Object> => {
        if (record === null) {
            throw new Error('Cannot add null catalog item');
        }

        let i = 0;
        const inventoryItems = [];
        for (i; i < quantity; i += 1) {
            const inventoryItem: InventoryItem = new InventoryItem(v4(), record, true);
            inventoryItems.push(inventoryItem);
        }

        // add new catalog item and inventory items to list
        this.catalogItems.set(record, inventoryItems);

        return await {
            catalogItem: record,
            inventory: inventoryItems,
        };
    }

    addInventoryItem = async (catalogItemId: string) : Promise<string> => {
        const catalogItems:CatalogItem[] = [...this.catalogItems.keys()];
        const specification:CatalogItem = catalogItems.find(item => item.id === catalogItemId);

        if (!specification) {
            return await null;
        }

        const inventoryItemId = v4();
        const inventoryItem:InventoryItem = new InventoryItem(inventoryItemId, specification, true);

        const inventoryItems = this.catalogItems.get(specification);
        this.catalogItems.set(specification, [...inventoryItems, inventoryItem]);

        return await inventoryItemId;
    }

    deleteItem = async (id: string): Promise<boolean> => {
        if (id === null) {
            throw new Error('Cannot delete catalog item of null id');
        }

        await CatalogTDG.delete(id);

        return await true;
    }

    deleteInventoryItem = async (catalogItemId: string) : Promise<boolean> => {
        const catalogItems = this.catalogItems.keys();
        let inventoryList = null;
        for (const catalogItem of catalogItems) {
            if (catalogItem.id === catalogItemId) {
                inventoryList = this.catalogItems.get(catalogItem);
            }
        }

        if (!inventoryList) {
            return await false;
        }

        let i = 0;
        for (i; i < inventoryList.length; i += 1) {
            if (inventoryList[i].available) {
                inventoryList.splice(i, 1); // remove one item from inventory
                return await true;
            }
        }

        return await false; // none of the items are available
    }
}

export default new CatalogService();
