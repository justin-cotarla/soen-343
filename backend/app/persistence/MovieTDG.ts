import { CatalogTDG } from './CatalogTDG';
import { Movie } from '../models';
import DatabaseUtil from '../utility/DatabaseUtil';

class MovieTDG extends CatalogTDG{
    async find(id: string) : Promise<Movie> {
        try {
            const query = `
                SELECT
                *
                FROM CATALOG_ITEM
                JOIN MOVIE
                ON CATALOG_ITEM.ID = MOVIE.CATALOG_ITEM_ID
                WHERE ID = ?
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
                movie.TIMESTAMP,
            );
        } catch (err) {
            console.log(err);
        }
    }

    async findAll(queryParam: string): Promise<Movie[]> {
        try {
            if (!queryParam) {
                const query = `
                SELECT
                *
                FROM
                CATALOG_ITEM
                JOIN MOVIE
                ON ID = CATALOG_ITEM_ID
                `;

                const data = await DatabaseUtil.sendQuery(query);
                if (!data.rows.length) {
                    return [];
                }

                return data.rows.map((movie: any) => new Movie(
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
                ));
            }

            const query = `
            SELECT
            *
            FROM
            CATALOG_ITEM
            JOIN MOVIE
            ON ID = CATALOG_ITEM_ID
            WHERE TITLE LIKE ? OR
                DIRECTOR LIKE ? OR
                PRODUCERS LIKE ? OR
                ACTORS LIKE ?
            `;

            const newQueryParam = `%${queryParam}%`;
            const data = await DatabaseUtil.sendQuery(query, [
                newQueryParam,
                newQueryParam,
                newQueryParam,
                newQueryParam,
            ]);
            if (!data.rows.length) {
                return [];
            }

            return data.rows.map((movie: any) => new Movie(
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
            ));
        } catch (err) {
            console.log(err);
        }
    }

    async insert(item: Movie): Promise<Movie> {
        try {
            const queryMovie  = `
            INSERT
            INTO
            MOVIE
            (
                DIRECTOR,
                PRODUCERS,
                ACTORS,
                LANGUAGE,
                SUBTITLES,
                DUBBED,
                RUNTIME,
                CATALOG_ITEM_ID
            )
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const catalogItem = await super.insert(item);

            await DatabaseUtil.sendQuery(queryMovie, [
                item.director,
                item.producers,
                item.actors,
                item.language,
                item.subtitles,
                item.dubbed,
                item.runtime.toString(),
                catalogItem.id,
            ]);

            return new Movie(
                catalogItem.id,
                catalogItem.title,
                catalogItem.date,
                item.director,
                item.producers,
                item.actors,
                item.language,
                item.subtitles,
                item.dubbed,
                item.runtime,
            );
        } catch (err) {
            console.log(err);
        }
    }

    async update(item: Movie): Promise<void> {
        try {
            const query = `
                UPDATE
                CATALOG_ITEM
                JOIN MOVIE ON ID = CATALOG_ITEM_ID
                SET
                TITLE = ?,
                DATE = ?,
                TIMESTAMP = CURRENT_TIMESTAMP,
                DIRECTOR = ?,
                PRODUCERS = ?,
                ACTORS = ?,
                LANGUAGE = ?,
                SUBTITLES = ?,
                DUBBED = ?,
                RUNTIME = ?
                WHERE ID = ? AND TIMESTAMP LIKE ?
            `;

            await DatabaseUtil.sendQuery(query, [
                item.title,
                item.date,
                item.director,
                item.producers,
                item.actors,
                item.language,
                item.subtitles,
                item.dubbed,
                item.runtime.toString(),
                item.id,
                item.timestamp,
            ]);
        } catch (err) {
            console.log(err);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const query = `
                DELETE
                FROM MOVIE
                WHERE CATALOG_ITEM_ID = ?
            `;

            await DatabaseUtil.sendQuery(query, [id]);
            await super.delete(id);
        } catch (err) {
            console.log(err);
        }
    }
}

export default new MovieTDG();
