import { TableDataGateway } from './TableDataGateway';
import { Music } from '../models';
import DatabaseUtil from '../utility/DatabaseUtil';


class MusicTDG implements TableDataGateway {

    find = async(id: string): Promise<Music> => {

        try {
            const query = `
                SELECT
                ID, TITLE, DATE, TYPE, ARTIST, LABEL, ASIN
                FROM CATALOG_ITEM
                INNER JOIN MUSIC ON CATALOG_ITEM.ID = MUSIC.CATALOG_ITEM_ID
                WHERE ID = ?;
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
            console.log(`error: ${err}`);
            return null;
        }    
    }
    insert = async(item: Music): Promise<boolean> => {
        if (item === null) {
            throw new Error('Cannot add null music item');
        }
        try {
            const queryCatalogItem = `
                INSERT INTO CATALOG_ITEM
                (TITLE, DATE)
                VALUES
                (?, ?);
            `;
            const queryMusic = `
                INSERT INTO MUSIC
                (TYPE, ARTIST, LABEL, ASIN, CATALOG_ITEM_ID)
                VALUES
                (?, ?, ?, ?, ?);
            `;

            const result = await DatabaseUtil.sendQuery(queryCatalogItem, [
                item.title,
                item.date]);

             await DatabaseUtil.sendQuery(queryMusic, [
                item.type.toString(),
                item.artist,
                item.label,
                item.asin,
                result.rows.insertId]);
            
            return true;
        } catch (err) {
            console.log(`error: ${err}`);
            return null;
        }
    }
    update = async (item: Music): Promise<boolean> => {
        try {
            const queryCatalogItem = `
                UPDATE
                CATALOG_ITEM
                SET TITLE = ?,
                DATE = ?
                WHERE ID = ?;
            `;
            const queryMusic = `
                UPDATE
                MUSIC
                SET TYPE = ?,
                ARTIST = ?,
                LABEL = ?,
                ASIN = ?,
                WHERE CATALOG_ITEM_ID = ?;
            `;

             await DatabaseUtil.sendQuery(queryCatalogItem, [
                item.title,
                item.date,
                item.id]);

             await DatabaseUtil.sendQuery(queryMusic, [
                item.type.toString(),
                item.artist,
                item.label,
                item.asin,
                item.id]);
                
            return true;
        } catch (err) {
            console.log(`error: ${err}`);
            return false;
        }
    }
    delete = async (id:string): Promise<Music> => {
        const foundMusic = await this.find(id);
        if (foundMusic) {
            try {
            
                const queryMusic = `
                    DELETE
                    FROM MUSIC
                    WHERE CATALOG_ITEM_ID = ?;
                `;
                const queryInventory = `
                    DELETE
                    FROM INVENTORY_ITEM
                    WHERE CATALOG_ITEM_ID = ?;
                `;
                const queryCatalog = `
                    DELETE
                    FROM CATALOG_ITEM
                    WHERE ID = ?;
                `;
                await DatabaseUtil.sendQuery(queryMusic, [id]);
                await DatabaseUtil.sendQuery(queryInventory, [id]);
                await DatabaseUtil.sendQuery(queryCatalog, [id]);
                return foundMusic;
            } catch (err) {
                console.log(`error: ${err}`);
                return null;
            }
        }
        return null;
    }
}
