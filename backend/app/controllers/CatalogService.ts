import { Request, Response } from 'express';
import { authenticate, generateToken, register } from '../utility/AuthUtil';
import { BookFormat } from '../models/Book';
import { MusicType } from '../models/Music';
import DatabaseUtil from '../utility/DatabaseUtil';
import v4 from 'uuid/v4';
import { Administrator, CatalogItem, InventoryItem, Book, Magazine, Movie, Music } from '../models';

class CatalogService {
    private catalogItems: Map<CatalogItem, InventoryItem[]> = new Map();

    viewCatalogItems = async (req: Request, res: Response) => {
        // TO DO: Modify and implement db fetching according to the db schema
        if (!req.user) {
            return res.status(403).end();
        }

        try {
            /*let query = `
                SELECT
                *
                FROM BOOK, INVENTORY
                WHERE INVENTORY.SPECIFICATION = BOOK
            `;

            let data = await DatabaseUtil.sendQuery(query);
            data.rows.map(spec =>
                this.catalogRecords.map(new Book(
                    spec.catalogItemId,
                    spec.title,
                    spec.date,
                    spec.isbn10,
                    spec.isbn13,
                    spec.author,
                    spec.publisher,
                    spec.format,
                    spec.pages,
                ),
                new InventoryItem(
                    spec.inventoryItemId,
                    spec.specification,
                    spec.availability
                ));

            query = `
                SELECT
                *
                FROM MUSIC, INVENTORY
                WHERE INVENTORY.SPECIFICATION = MUSIC
            `;

            data = await DatabaseUtil.sendQuery(query);
            data.rows.map(spec =>
                this.catalogRecords.map(new Music(
                    spec.id,
                    spec.title,
                    spec.date,
                    spec.type,
                    spec.artist,
                    spec.label,
                    spec.asin,
                ),
                 new InventoryItem(
                    spec.inventoryItemId,
                    spec.specification,
                    spec.availability
                ));

            query = `
                SELECT
                *
                FROM MAGAZINE, INVENTORY
                WHERE INVENTORY.SPECIFICATION = MAGAZINE
            `;

            data = await DatabaseUtil.sendQuery(query);
            data.rows.map(spec =>
                this.catalogRecords.map(new Magazine(
                    spec.id,
                    spec.title,
                    spec.date,
                    spec.isbn10,
                    spec.isbn13,
                    spec.publisher,
                    spec.language,
                ),
                 new InventoryItem(
                    spec.inventoryItemId,
                    spec.specification,
                    spec.availability
                ));

            query = `
                SELECT
                *
                FROM MOVIE, INVENTORY
                WHERE INVENTORY.SPECIFICATION = MOVIE
            `;

            data = await DatabaseUtil.sendQuery(query);
            data.rows.map(spec =>
                this.catalogRecords.push(map Movie(
                    spec.id,
                    spec.title,
                    spec.date,
                    spec.director,
                    spec.producers,
                    spec.actors,
                    spec.language,
                    spec.subtitles,
                    spec.dubbed,
                    spec.runtime,
                ),
                 new InventoryItem(
                    spec.inventoryItemId,
                    spec.specification,
                    spec.availability
                ));*/

            const records =
                Array.from(this.catalogItems.entries())
                    .reduce((o, [catalogItem, inventoryItems]) => {
                        const res = {
                            catalogItem,
                            inventoryItems,
                        };
                        o.push(res);
                        return o;
                    },      []);

            return res.status(200).json(records);
        } catch (err) {
            console.log('error: ${err}');
            return res.status(400).end();
        }
    }

    async updateCatalog(req: Request, res: Response) {

    }

    createCatalogItem = async (req: Request, res: Response) => {
        // TODO: Catalog item must not already exist
        // Check with db to see if entry with spec exists

        // Must be an admin to create catalog items
        if (!req.user && !(req.user instanceof Administrator)) {
            return res.status(403).end();
        }

        // Response body must have these fields
        const { type, spec, quantity } = req.body;
        if (!type || !spec || !quantity) {
            return res.status(401).end();
        }

        // Spec must contain these common attributes
        const { title, date } = spec;
        if (!title || !date) {
            return res.status(401).end();
        }

        let specification: CatalogItem = null;
        switch (type) {
        case 'Book': {
            const {
                isbn10,
                isbn13,
                author,
                publisher,
                format,
                pages,
            } = spec;

            if (isbn10 && isbn13 && author && publisher && format && pages) {
                specification = new Book(
                    v4(), title, date, isbn10, isbn13, author, publisher, format, pages);
            } else {
                return res.status(401).end();
            }
        }
            break;
        case 'Magazine': {
            const {
                isbn10,
                isbn13,
                publisher,
                language,
            } = spec;

            if (isbn10 && publisher && language) {
                specification = new Magazine(
                    v4(), title, date, isbn10, isbn13, publisher, language);
            } else {
                return res.status(401).end();
            }
        }
            break;
        case 'Movie': {
            const {
                director,
                producers,
                actors,
                language,
                subtitles,
                dubbed,
                runtime,
            } = spec;

            if (director && producers && actors && language
                && subtitles && dubbed && runtime) {
                specification = new Movie(
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
            } else {
                return res.status(401).end();
            }

        }
            break;
        case 'Music': {
            const {
                type,
                artist,
                label,
                asin,
            } = spec;

            if (type && artist && label && asin) {
                specification = new Music(v4(), title, date, type, artist, label, asin);
            } else {
                return res.status(401).end();
            }
        }
            break;
        default: {
            return res.status(401).end();
        }
        }

        // create quantity of inventory items
        let i = 0;
        const inventoryItems = [];
        for (i; i < quantity; i += 1) {
            const inventoryItem: InventoryItem = new InventoryItem(v4(), specification, true);
            inventoryItems.push(inventoryItem);
        }

        // add new catalog item and inventory items to list
        this.catalogItems.set(specification, inventoryItems);

        return res.status(200).json({ spec: specification, quantity: i });

    }

    async addInventoryItem(req: Request, res: Response) {

    }

    async deleteCatalogItem(req: Request, res: Response) {

    }
}

export default new CatalogService();
