import { authenticate, generateToken, register } from '../utility/AuthUtil';
import { BookFormat } from '../models/Book';
import { MusicType } from '../models/Music';
import DatabaseUtil from '../utility/DatabaseUtil';
import { CatalogItem, InventoryItem, Book, Magazine, Movie, Music } from '../models';

import v4 from 'uuid/v4';

class CatalogService {
    private catalogItems: Map<CatalogItem, InventoryItem[]> = new Map();

    viewCatalogItems = async () => {
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

    async updateCatalog(req: Request, res: Response) {

    }

    addCatalogItem = async (record: CatalogItem, quantity: number) => {
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

        return {
            catalogItem: record,
            inventory: inventoryItems,
        };
    }

    async addInventoryItem(req: Request, res: Response) {

    }

    async deleteCatalogItem(req: Request, res: Response) {

    }
}

export default new CatalogService();
