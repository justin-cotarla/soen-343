import { Request, Response } from 'express';
import { CatalogItem, InventoryItem } from '../models';
import DatabaseUtil from '../utility/DatabaseUtil';

class CatalogService {
    private catalogItems: CatalogItem[];

    async viewCatalogItems(req: Request, res: Response) {

    }

    async updateCatalog(req: Request, res: Response) {

    }

    async createCatalogItem(req: Request, res: Response) {

    }

    async addInventoryItem(req: Request, res: Response) {

    }

    async deleteCatalogItem(req: Request, res: Response) {

    }
}

export default new CatalogService();
