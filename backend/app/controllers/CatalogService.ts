import { Request, Response } from 'express';
import { authenticate, generateToken, register } from '../utility/AuthUtil';
import { CatalogItem, Music, Book, Movie, Magazine, Administrator, Client } from '../models';
import { BookFormat } from '../models/Book';
import { MusicType } from '../models/Music';
import DatabaseUtil from '../utility/DatabaseUtil';

class CatalogService {
    private catalogItems: CatalogItem[];

    async viewCatalogItems(req: Request, res: Response) {
        if (!req.user) {
            return res.status(403).end();
        }

        try {
            const catalogRecords = Array<CatalogItem>();
            /*let query = `
                SELECT
                *
                FROM BOOK
            `;

            let data = await DatabaseUtil.sendQuery(query);
            data.rows.map(spec =>
                catalogRecords.push(new Book(
                    spec.id,
                    spec.title,
                    spec.date,
                    spec.isbn10,
                    spec.isbn13,
                    spec.author,
                    spec.publisher,
                    spec.format,
                    spec.pages,
                )));

            query = `
                SELECT
                *
                FROM MUSIC
            `;

            data = await DatabaseUtil.sendQuery(query);
            data.rows.map(spec =>
                catalogRecords.push(new Music(
                    spec.id,
                    spec.title,
                    spec.date,
                    spec.type,
                    spec.artist,
                    spec.label,
                    spec.asin,
                )));

            query = `
                SELECT
                *
                FROM MAGAZINE
            `;

            data = await DatabaseUtil.sendQuery(query);
            data.rows.map(spec =>
                catalogRecords.push(new Magazine(
                    spec.id,
                    spec.title,
                    spec.date,
                    spec.isbn10,
                    spec.isbn13,
                    spec.publisher,
                    spec.language,
                )));

            query = `
                SELECT
                *
                FROM MOVIE
            `;

            data = await DatabaseUtil.sendQuery(query);
            data.rows.map(spec =>
                catalogRecords.push(new Movie(
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
                )));*/

            return res.status(200).json(catalogRecords);
        } catch (err) {
            console.log('error: ${err}');
            return res.status(400).end();
        }
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
