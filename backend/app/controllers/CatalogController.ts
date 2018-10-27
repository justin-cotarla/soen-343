import express, { Request, Response } from 'express';

import { Administrator, Book, Magazine, Music, Movie } from '../models';
import Catalog, { CatalogItemType } from '../services/Catalog';

const catalogRouter = express.Router();

catalogRouter.get('/', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(403).end();
    }

    try {
        const items = await Catalog.viewItems();
        return res.status(200).json(items);
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
});

catalogRouter.put('/:type', async (req: Request, res: Response) => {
    // Must be an admin to create catalog items
    if (!req.user || !(req.user instanceof Administrator)) {
        return res.status(403).end();
    }

    // Get the catalogItem type
    const { type } = req.params;
    if (!type) {
        return res.status(400).end();
    }

    // Response body must have these fields
    const { catalogItem, quantity } = req.body;
    if (!catalogItem || !quantity) {
        return res.status(400).end();
    }

    // Spec must contain these common attributes
    const { title, date } = catalogItem;
    if (!title || !date) {
        return res.status(400).end();
    }

    let item: any = null;
    switch (type) {
    case 'book': {
        const {
            isbn10,
            isbn13,
            author,
            publisher,
            format,
            pages,
        } = catalogItem;

        if (isbn10 && isbn13 && author && publisher && format && pages) {
            try {
                item = await Catalog.addItem(catalogItem, CatalogItemType.BOOK, quantity);
            } catch (err) {
                console.log(err);
                return res.status(500).end();
            }
        }
    }
        break;
    case 'magazine': {
        const {
            isbn10,
            isbn13,
            publisher,
            language,
        } = catalogItem;

        if (isbn10 && isbn13 && publisher && language) {
            try {
                item = await Catalog.addItem(catalogItem, CatalogItemType.MAGAZINE, quantity);
            } catch (err) {
                console.log(err);
                return res.status(500).end();
            }
        }
    }
        break;
    case 'movie': {
        const {
            director,
            producers,
            actors,
            language,
            subtitles,
            dubbed,
            runtime,
        } = catalogItem;

        if (director && producers && actors && language
            && subtitles && dubbed && runtime) {
            try {
                item = await Catalog.addItem(catalogItem, CatalogItemType.MOVIE, quantity);
            } catch (err) {
                console.log(err);
                return res.status(500).end();
            }
        }
    }
        break;
    case 'music': {
        const {
            type,
            artist,
            label,
            asin,
        } = catalogItem;

        if (type && artist && label && asin) {
            try {
                item = await Catalog.addItem(catalogItem, CatalogItemType.MUSIC, quantity);
            } catch (err) {
                console.log(err);
                return res.status(500).end();
            }
        }
    }
        break;
    }

    if (!item) {
        return res.status(400).end();
    }

    return res.status(200).json(item);
});

catalogRouter.put('/:type/:catalogItemId/inventory', async (req: Request, res: Response) => {
    if (!req.user || !(req.user instanceof Administrator)) {
        return res.status(403).end();
    }

    const { catalogItemId } = req.params;
    try {
        const inventoryItemId = await Catalog.addInventoryItem(catalogItemId);
        if (inventoryItemId) {
            return res.status(200).json({ id: inventoryItemId });
        }
        return res.status(404).end();
    } catch (error) {
        return res.status(500).end();
    }
});

catalogRouter.post('/:type/:id', async (req: Request, res: Response) => {
    // Must be an admin to modify catalog items
    if (!req.user || !(req.user instanceof Administrator)) {
        return res.status(403).end();
    }

    //  Get the catalog item type and the id of the item
    const catalogItemType = req.params.type;
    const catalogItemId = req.params.id;

    if (!catalogItemType || !catalogItemId) {
        return res.status(400).end();
    }

    // Response body must have the new catalog item
    const catalogItem = req.body;
    if (!catalogItem) {
        return res.status(400).end();
    }

    let item: any = null;
    switch (catalogItemType) {
    case 'book': {
        const {
            isbn10,
            isbn13,
            author,
            publisher,
            format,
            pages,
        } = catalogItem;

        if (isbn10 && isbn13 && author && publisher && format && pages) {
            catalogItem.id = catalogItemId;
            try {
                item = await Catalog.updateItem(catalogItem, CatalogItemType.BOOK);
            } catch (err) {
                console.log(err);
                return res.status(500).end();
            }
        }
    }
        break;
    case 'magazine': {
        const {
            isbn10,
            isbn13,
            publisher,
            language,
        } = catalogItem;

        if (isbn10 && isbn13 && publisher && language) {
            catalogItem.id = catalogItemId;
            try {
                item = await Catalog.updateItem(catalogItem, CatalogItemType.MAGAZINE);
            } catch (err) {
                console.log(err);
                return res.status(500).end();
            }
        }
    }
        break;
    case 'movie': {
        const {
            director,
            producers,
            actors,
            language,
            subtitles,
            dubbed,
            runtime,
        } = catalogItem;

        if (director && producers && actors && language
            && subtitles && dubbed && runtime) {
            catalogItem.id = catalogItemId;
            try {
                item = await Catalog.updateItem(catalogItem, CatalogItemType.MOVIE);
            } catch (err) {
                console.log(err);
                return res.status(500).end();
            }
        }
    }
        break;
    case 'music': {
        const {
            type,
            artist,
            label,
            asin,
        } = catalogItem;

        if (type && artist && label && asin) {
            catalogItem.id = catalogItemId;
            try {
                item = await Catalog.updateItem(catalogItem, CatalogItemType.MUSIC);
            } catch (err) {
                console.log(err);
                return res.status(500).end();
            }
        }
    }
        break;
    }

    if (!item) {
        return res.status(400).end();
    }

    return res.status(200).json(item);

});

catalogRouter.delete('/:id/inventory', async (req: Request, res: Response) => {
    if (!req.user || !(req.user instanceof Administrator)) {
        return res.status(403).end();
    }

    const catalogItemId = req.params.id;
    if (!catalogItemId) {
        return res.status(400).end();
    }

    if (await Catalog.deleteInventoryItem(catalogItemId)) {
        return res.status(200).end();
    }

    return res.status(404).end();
});

catalogRouter.delete('/:type/:id', async (req: Request, res: Response) => {
    if (!req.user || !(req.user instanceof Administrator)) {
        return res.status(403).end();
    }

    const { catalogItemId, type } = req.params;

    if (!catalogItemId) {
        return res.status(400).end();
    }

    if (await Catalog.deleteItem(catalogItemId, type)) {
        return res.status(200).end();
    }

    return res.status(404).end();
});

export { catalogRouter };
