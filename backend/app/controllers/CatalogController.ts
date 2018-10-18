import express, { Request, Response } from 'express';
import { Administrator, CatalogItem, Book, Magazine, Music, Movie } from '../models';
import v4 from 'uuid/v4';

import CatalogService from '../services/CatalogService';

const catalogRouter = express.Router();

catalogRouter.get('/', async (req: Request, res: Response) => {
    // TO DO: Fetch from db
    if (!req.user) {
        return res.status(403).end();
    }

    try {
        const records = await CatalogService.viewCatalogItems();
        return res.status(200).json(records);
    } catch (error) {
        console.log('error: ${error}');
        return res.status(400).end();
    }
});

catalogRouter.put('/:type', async (req: Request, res: Response) => {
    // Must be an admin to create catalog items
    if (!req.user && !(req.user instanceof Administrator)) {
        return res.status(403).end();
    }

    // Get the catalogItem type
    const { type } = req.params;
    if (!type) {
        return res.status(401).end();
    }

    // Response body must have these fields
    const { catalogItem, quantity } = req.body;
    if (!catalogItem || !quantity) {
        return res.status(401).end();
    }

    // Spec must contain these common attributes
    const { title, date } = catalogItem;
    if (!title || !date) {
        return res.status(401).end();
    }

    let record: CatalogItem = null;
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
            record = new Book(
                v4(), title, date, isbn10, isbn13, author, publisher, format, pages);
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

        if (isbn10 && publisher && language) {
            record = new Magazine(
                v4(), title, date, isbn10, isbn13, publisher, language);
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
            record = new Movie(
                v4(),
                title,
                date,
                director,
                producers,
                actors,
                language,
                subtitles,
                dubbed,
                runtime,
            );
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
            record = new Music(v4(), title, date, type, artist, label, asin);
        }
    }
        break;
    }

    if (!catalogItem) {
        return res.status(401).end();
    }

    try {
        const catalogItem = await CatalogService.addCatalogItem(record, quantity);
        return res.status(200).json(catalogItem);
    } catch (error) {
        return res.status(401).end();
    }
});

catalogRouter.put('/:catalogItemId/inventory', async (req: Request, res: Response) => {
    if (!req.user && !(req.user instanceof Administrator)) {
        return res.status(403).end();
    }

    const { catalogItemId } = req.params;
    try {
        const inventoryItemId = await CatalogService.addInventoryItem(catalogItemId);
        if (inventoryItemId) {
            return res.status(200).json({ id: inventoryItemId });
        }
        return res.status(404).end();
    } catch (error) {
        return res.status(500).end();
    }
});

catalogRouter.delete('/:id', async (req: Request, res: Response) => {
    if (!req.user && !(req.user instanceof Administrator)) {
        return res.status(403).end();
    }

    const catalogItemId = req.params.id;
    if (!catalogItemId) {
        return res.status(401).end();
    }

    if (await CatalogService.deleteCatalogItem(catalogItemId)) {
        return res.status(200).end();
    }

    return res.status(404).end();
});

catalogRouter.delete('/inventory/:id', async (req: Request, res: Response) => {
    if (!req.user && !(req.user instanceof Administrator)) {
        return res.status(403).end();
    }

    const inventoryItemId = req.params.id;
    if (!inventoryItemId) {
        return res.status(401).end();
    }

    if (await CatalogService.deleteInventoryItem(inventoryItemId)) {
        return res.status(200).end();
    }

    return res.status(404).end();
});

export { catalogRouter };
