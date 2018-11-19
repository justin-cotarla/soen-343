import express, { Request, Response } from 'express';

import { Administrator } from '../models';
import Catalog, { CatalogItemType } from '../services/Catalog';

const catalogController = express.Router();

catalogController.get('/', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).end();
    }

    const { query, order, direction } = req.query;

    try {
        const items = await Catalog.viewItems(query, order, direction);
        return res.status(200).json(items.map(item => ({
            catalogItemType: item.constructor.name.toLowerCase(),
            ...item,
        })));
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
});

catalogController.get('/:type', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).end();
    }

    //  Get the catalog item type
    const { type:catalogItemType } = req.params;

    // Must be valid type
    if (!Object.values(CatalogItemType).includes(catalogItemType.toUpperCase())) {
        return res.status(400).end();
    }

    const { query, order, direction } = req.query;

    try {
        const items = await Catalog.viewItems(
            query,
            order,
            direction,
            catalogItemType.toUpperCase(),
            );
        return res.status(200).json(items.map(item => ({
            catalogItemType: item.constructor.name.toLowerCase(),
            ...item,
        })));
    } catch (error) {
        console.log(error);
        return res.status(500).end();
    }
});

catalogController.put('/:type', async (req: Request, res: Response) => {
    // Must be an admin to create catalog items
    if (!req.user || !(req.user instanceof Administrator)) {
        return res.status(403).end();
    }

    const { type:catalogItemType } = req.params;

    // Must be valid type
    if (!Object.values(CatalogItemType).includes(catalogItemType.toUpperCase())) {
        return res.status(400).end();
    }

    // Response body must have these fields
    const { catalogItem, quantity } = req.body;
    if (!catalogItem || !quantity) {
        return res.status(400).end();
    }

    const {
        title,
        date,
        isbn10,
        isbn13,
        author,
        publisher,
        format,
        pages,
        language,
        director,
        producers,
        actors,
        subtitles,
        dubbed,
        runtime,
        type,
        artist,
        label,
        asin,
    } = catalogItem;

    // Must have proper attributes
    if (
        !(title && date) || // Common
        (!(isbn10 && isbn13 && author && publisher && format && pages) && // Book
        !(isbn10 && isbn13 && publisher && language) && // Magazine
        !(director && producers && actors && language && subtitles && dubbed && runtime) && // Movie
        !(type && artist && label && asin)) // Music
    ) {
        return res.status(400).end();
    }

    try {
        const item = await Catalog.addItem(catalogItem, catalogItemType.toUpperCase(), quantity);
        return res.status(200).json(item);
    } catch (err) {
        console.log(err);
        return res.status(500).end();
    }
});

catalogController.get('/:type/:id', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).end();
    }

    //  Get the catalog item type and the id of the item
    const { type:catalogItemType, id:catalogItemId } = req.params;

    // Must be valid type
    if (!Object.values(CatalogItemType).includes(catalogItemType.toUpperCase())) {
        return res.status(400).end();
    }

    try {
        const item = await Catalog.viewItem(catalogItemId, catalogItemType.toUpperCase());
        const inventoryItems = await Catalog.viewInventoryItems(catalogItemId);

        if (!item) {
            return res.status(404).end();
        }

        return res.status(200).json({
            catalogItem: item,
            inventory: inventoryItems,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).end();
    }
});

catalogController.get('/:id', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).end();
    }

    const {id:catalogItemId} = req.params;
    try {
         var inventoryItem = {};
         const itemType = await Catalog.viewItemType(catalogItemId);

         switch (itemType) {
            case CatalogItemType.BOOK:
                const bookItem = await Catalog.viewBookItem(catalogItemId);
                inventoryItem = JSON.stringify(bookItem);
            case CatalogItemType.MUSIC:
                const musicItem = await Catalog.viewMusicItem(catalogItemId);
                inventoryItem = JSON.stringify(musicItem);
            case CatalogItemType.MAGAZINE:
                const MagazineItem = await Catalog.viewMagazingItem(catalogItemId);
                inventoryItem = JSON.stringify(MagazineItem);
            case CatalogItemType.MOVIE:
                const movieItem = await Catalog.viewMovieItem(catalogItemId);
                inventoryItem = JSON.stringify(movieItem);
            }
        return res.status(200).json({
            item: inventoryItem,
            type: itemType,
        });
   
    } catch (error) {
        console.log(error);
        return res.status(500).end();
    }
});

catalogController.put('/:type/:id/inventory', async (req: Request, res: Response) => {
    if (!req.user || !(req.user instanceof Administrator)) {
        return res.status(403).end();
    }

    const { id } = req.params;
    try {
        const inventoryItemId = await Catalog.addInventoryItem(id);
        if (inventoryItemId) {
            return res.status(200).json({ id: inventoryItemId });
        }
        return res.status(404).end();
    } catch (error) {
        console.log(error);
        return res.status(500).end();
    }
});

catalogController.post('/:type/:id', async (req: Request, res: Response) => {
    // Must be an admin to modify catalog items
    if (!req.user || !(req.user instanceof Administrator)) {
        return res.status(403).end();
    }

    //  Get the catalog item type and the id of the item
    const { type:catalogItemType, id:catalogItemId } = req.params;

    // Must be valid type
    if (!Object.values(CatalogItemType).includes(catalogItemType.toUpperCase())) {
        return res.status(400).end();
    }

    // Response body must have the new catalog item
    const { catalogItem } = req.body;

    const {
        title,
        date,
        isbn10,
        isbn13,
        author,
        publisher,
        format,
        pages,
        language,
        director,
        producers,
        actors,
        runtime,
        type,
        artist,
        label,
        asin,
    } = catalogItem;

    catalogItem.id = catalogItemId;

    // Must have proper (non-nullable) attributes
    if (
        !(title && date) || // Common
        (
            !(isbn10 && isbn13 && author && publisher && format && pages) && // Book
            !(isbn10 && isbn13 && publisher && language) && // Magazine
            !(director && producers && actors && language && runtime) && // Movie
            !(type && artist && label && asin)
        ) // Music
    ) {
        return res.status(400).end();
    }

    try {
        const item = await Catalog.updateItem(catalogItem, catalogItemType.toUpperCase());
        return res.status(200).json(item);
    } catch (err) {
        console.log(err);
        return res.status(500).end();
    }
});

catalogController.delete('/:type/:id/inventory', async (req: Request, res: Response) => {
    if (!req.user || !(req.user instanceof Administrator)) {
        return res.status(403).end();
    }

    const catalogItemId = req.params.id;

    if (await Catalog.deleteInventoryItem(catalogItemId)) {
        return res.status(200).end();
    }

    return res.status(404).end();
});

catalogController.delete('/:type/:id', async (req: Request, res: Response) => {
    if (!req.user || !(req.user instanceof Administrator)) {
        return res.status(403).end();
    }

    const { id:catalogItemId, type:catalogItemType } = req.params;

    // Must be valid type
    if (!Object.values(CatalogItemType).includes(catalogItemType.toUpperCase())) {
        return res.status(400).end();
    }

    if (await Catalog.deleteItem(catalogItemId, catalogItemType.toUpperCase())) {
        return res.status(200).end();
    }

    return res.status(404).end();
});

export { catalogController };
