import v4 from 'uuid/v4';
import { Request, Response } from 'express';
import { CatalogItem, InventoryItem, Book, Magazine, Movie, Music } from '../models';

class Catalog {

    viewItems = async () : Promise<CatalogItem[]> => {
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

    updateItem = async (record: CatalogItem) : Promise<Boolean> => {
        if (!record) {
            throw new Error('Cannot modify null catalog item');
        }
        switch (record.constructor) {
        case Book: {
            return await BookTDG.update(record);
        }
        case Music: {
            return await MusicTDG.update(record);
        }
        case Magazine: {
            return await MagazineTDG.update(record);
        }
        case Movie: {
            return await MovieTDG.update(record);
        }
        }
    }

    addItem = async (record: CatalogItem, quantity: number)
    : Promise<{ catalogItem: CatalogItem, inventory: InventoryItem[] }> => {
        if (record === null) {
            throw new Error('Cannot add null catalog item');
        }

        await CatalogTDG.insert(record);

        let i = 0;
        const inventoryItems = [];
        for (i; i < quantity; i += 1) {
            const inventoryItem: InventoryItem = new InventoryItem(v4(), record, true);
            await InventoryTDG.insert(inventoryItem);
            inventoryItems.push(inventoryItem);
        }

        return await {
            catalogItem: record,
            inventory: inventoryItems,
        };
    }

    addInventoryItem = async (catalogItemId: string) : Promise<string> => {
        const specification = await CatalogTDG.find(catalogItemId);

        if (!specification) {
            return null;
        }

        const inventoryItemId = v4();
        const inventoryItem:InventoryItem = new InventoryItem(inventoryItemId, specification, true);
        await InventoryTDG.insert(inventoryItem);

        return inventoryItemId;
    }

    deleteItem = async (id: string): Promise<boolean> => {
        if (id === null) {
            throw new Error('Cannot delete catalog item of null id');
        }
        const result = await CatalogTDG.delete(id);
        if (result === null) {
            return false;
        }
        return true;
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

export default new Catalog();
