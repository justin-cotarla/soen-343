import v4 from 'uuid/v4';
import { Request, Response } from 'express';
import {
    Administrator,
    CatalogItem,
    InventoryItem,
    Book,
    Magazine,
    Movie,
    Music,
} from '../models';

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

    addInventoryItem = async (req: Request, res: Response) => {
        if (!req.user && !(req.user instanceof Administrator)) {
            return res.status(403).end();
        }

        const { catalogItemId } = req.params;

        const catalogItems:CatalogItem[] = [...this.catalogItems.keys()];
        const specification:CatalogItem = catalogItems.find(item => item.id === catalogItemId);

        if (!specification) {
            return res.status(404).end();
        }

        const inventoryItemId = v4();
        const inventoryItem:InventoryItem = new InventoryItem(inventoryItemId, specification, true);

        const inventoryItems = this.catalogItems.get(specification);
        this.catalogItems.set(specification, [...inventoryItems, inventoryItem]);
        return res.status(200).json({ id: inventoryItemId });
    }

    deleteCatalogItem = async (req: Request, res: Response) => {
        if (!req.user && !(req.user instanceof Administrator)) {
            return res.status(403).end();
        }

        if (!req.params.id) {
            return res.status(401).end();
        }

        this.catalogItems.forEach((value, key) => {
            if (req.params.id === key.id) {
                if (this.catalogItems.delete(key)) {
                    return res.status(200).end();
                }

                return res.status(401).end();
            }
        });

    }

    deleteInventoryItem = async (req: Request, res: Response) => {
        // Must be an admin to delete inventory items
        if (!req.user && !(req.user instanceof Administrator)) {
            return res.status(403).end();
        }

        if (!req.params.id) {
            return res.status(401).end();
        }

        const inventoryList = this.catalogItems.get(req.params.id);

        if (!inventoryList) {
            return res.status(401).end();
        }

        let i = 0;
        for (i; i < inventoryList.length; i += 1) {
            if (inventoryList[i].available) {
                inventoryList.splice(i, 1); // remove one item from inventory
                return res.status(200).end();
            }
            return res.status(401).end(); // none of the items are available
        }
    }
}

export default new CatalogService();
