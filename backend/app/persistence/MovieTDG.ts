import { TableDataGateway } from './TableDataGateway';
import { Movie } from '../models';
import DatabaseUtil from '../utility/DatabaseUtil';

class MovieTDG implements TableDataGateway {

    find = async (id: string): Promise<Movie> => {
        try {
            const query = `
                SELECT
                ID, TITLE, DATE, DIRECTOR, PRODUCERS, ACTORS, LANGUAGE, SUBTITLES, DUBBED, RUNTIME
                FROM CATALOG_ITEM
                INNER JOIN MOVIE ON CATALOG_ITEM.ID = MOVIE.CATALOG_ITEM_ID
                WHERE ID = ?;
            `;

            const data = await DatabaseUtil.sendQuery(query, [id]);
            if (!data.rows.length) {
                return null;
            }

            const movie = data.rows[0];
            return new Movie(
                    movie.ID,
                    movie.TITLE,
                    movie.DATE,
                    movie.DIRECTOR,
                    movie.PRODUCERS,
                    movie.ACTORS,
                    movie.LANGUAGE,
                    movie.SUBTITLES,
                    movie.DUBBED,
                    movie.RUNTIME,
                );
        } catch (err) {
            console.log(`error: ${err}`);
            return null;
        }
    }

    insert = async (item: Movie): Promise<boolean> => {
        try {
            const queryCatalogItem = `
                INSERT INTO CATALOG_ITEM
                (TITLE, DATE)
                VALUES
                (?, ?);
            `;
            const queryMovie = `
                INSERT INTO MOVIE
                (DIRECTOR, PRODUCERS, ACTORS, LANGUAGE, SUBTITLES, DUBBED, RUNTIME, CATALOG_ITEM_ID)
                VALUES
                (?, ?, ?, ?, ?, ?, ?, ?);
            `;

            const result = await DatabaseUtil.sendQuery(queryCatalogItem, [
                item.title,
                item.date]);

            await DatabaseUtil.sendQuery(queryMovie, [
                item.director,
                item.producers,
                item.actors,
                item.language,
                item.subtitles,
                item.dubbed,
                item.runtime.toString(),
                result.rows.insertId]);
            return true;
        } catch (err) {
            console.log(`error: ${err}`);
            return null;
        }
    }

    update = async (item: Movie): Promise<boolean> => {
        try {
            const queryCatalogItem = `
                UPDATE
                CATALOG_ITEM
                SET TITLE = ?,
                DATE = ?
                WHERE ID = ?;
            `;
            const queryMovie = `
                UPDATE
                MOVIE
                SET DIRECTOR = ?,
                PRODUCERS = ?,
                ACTORS = ?,
                LANGUAGE = ?,
                SUBTITLES = ?,
                DUBBED = ?,
                RUNTIME = ?,
                WHERE CATALOG_ITEM_ID = ?;
            `;

            await DatabaseUtil.sendQuery(queryCatalogItem, [
                item.title,
                item.date,
                item.id]);

            await DatabaseUtil.sendQuery(queryMovie, [
                item.director,
                item.producers,
                item.actors,
                item.language,
                item.subtitles,
                item.dubbed,
                item.runtime.toString(),
                item.id]);
            return true;
        } catch (err) {
            console.log(`error: ${err}`);
            return false;
        }
    }

    delete = async (id:string): Promise<Movie> => {
        const foundMovie = await this.find(id);
        if (foundMovie) {
            try {
                const queryInventory = `
                    DELETE
                    FROM INVENTORY_ITEM
                    WHERE CATALOG_ITEM_ID = ?;
                `;
                const queryMovie = `
                    DELETE
                    FROM MOVIE
                    WHERE CATALOG_ITEM_ID = ?;
                `;
                const queryCatalog = `
                    DELETE
                    FROM CATALOG_ITEM
                    WHERE ID = ?;
                `;
                await DatabaseUtil.sendQuery(queryInventory, [id]);
                await DatabaseUtil.sendQuery(queryMovie, [id]);
                await DatabaseUtil.sendQuery(queryCatalog, [id]);
                return foundMovie;
            } catch (err) {
                console.log(`error: ${err}`);
                return null;
            }
        }
        return null;
    }

}
