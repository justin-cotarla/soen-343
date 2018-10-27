import { CatalogTDG } from './CatalogTDG';
import { Music } from '../models';
import DatabaseUtil from '../utility/DatabaseUtil';

class MusicTDG extends CatalogTDG{
    find = async(id: string) : Promise<Music> => {
        try {
            const query = `
                SELECT
                *
                FROM CATALOG_ITEM
                JOIN MUSIC
                ON CATALOG_ITEM.ID = MUSIC.CATALOG_ITEM_ID
                WHERE ID = ?
            `;

            const data = await DatabaseUtil.sendQuery(query, [id]);
            if (!data.rows.length) {
                return null;
            }

            const music = data.rows[0];
            return new Music(
                music.ID,
                music.TITLE,
                music.DATE,
                music.TYPE,
                music.ARTIST,
                music.LABEL,
                music.ASIN,
            );
        } catch (err) {
            console.log(err);
        }
    }

    findAll = async (): Promise<Music[]> => {
        try {
            const query = `
            SELECT
            *
            FROM
            CATALOG_ITEM
            JOIN MUSIC
            ON ID = CATALOG_ITEM_ID
            `;
            const data = await DatabaseUtil.sendQuery(query);
            if (!data.rows.length) {
                return [];
            }

            return data.rows.map((music: any) => new Music(
                    music.ID,
                    music.TITLE,
                    music.DATE,
                    music.TYPE,
                    music.ARTIST,
                    music.LABEL,
                    music.ASIN,
                ));
        } catch (err) {
            console.log(err);
        }
    }

    insert = async (item: Music): Promise<Music> => {
        try {
            const queryMusic = `
            INSERT
            INTO
            MUSIC
            (
                TYPE,
                ARTIST,
                LABEL,
                CATALOG_ITEM_ID
                ASIN,
            )
            VALUES
            (?, ?, ?, ?, ?)
            `;
            const catalogItem = await super.insert(item);

            await DatabaseUtil.sendQuery(queryMusic, [
                item.type,
                item.artist,
                item.label,
                item.asin,
                catalogItem.id,
            ]);

            return new Music(
                catalogItem.id,
                catalogItem.title,
                catalogItem.date,
                item.type,
                item.artist,
                item.label,
                item.asin,
            );
        } catch (err) {
            console.log(err);
        }
    }

    update = async (item: Music): Promise<void> => {
        try {
            const query = `
                UPDATE
                CATALOG_ITEM
                JOIN MUSIC ON ID = CATALOG_ITEM_ID
                SET
                TITLE = ?,
                DATE = ?,
                TYPE = ?,
                ARTIST = ?,
                LABEL = ?,
                ASIN = ?,
                WHERE CATALOG.ID = ?
            `;

            await DatabaseUtil.sendQuery(query, [
                item.title,
                item.date,
                item.type,
                item.artist,
                item.label,
                item.asin,
                item.id,
            ]);
        } catch (err) {
            console.log(err);
        }
    }

    delete = async (id: string): Promise<void> => {
        try {
            const query = `
                DELETE
                FROM MUSIC
                WHERE CATALOG_ITEM_ID = ?
            `;

            await DatabaseUtil.sendQuery(query, [id]);
            await super.delete(id);
        } catch (err) {
            console.log(err);
        }
    }
}

export default new MusicTDG();
