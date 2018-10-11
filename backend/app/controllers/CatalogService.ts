import { Request, Response } from 'express';
import { CatalogItem } from '../models/CatalogItem';
import { InventoryItem } from '../models/InventoryItem';
import DatabaseUtil from '../utility/DatabaseUtil';

class CatalogService {
    private catalogItems: CatalogItem[];

    public viewCatalogItems() {

    }

    public updateCatalog(record: CatalogItem) {

    }

    public createCatalogItem(record: CatalogItem, quantity: number) {

    }

    public addInventoryItem(record: InventoryItem) {

    }

    public deleteCatalogItem(id: number) {

    }
}

export default new CatalogService();
