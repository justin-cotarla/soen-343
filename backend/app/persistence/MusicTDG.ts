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
                INNER JOIN MOVIE ON CATALOG_ITEM.ID = MUSIC.CATALOG_ITEM_ID
                WHERE ID = ?;
            `;

             const data = await DatabaseUtil.sendQuery(query, [id]);
            if (!data.rows.length) {
                return null;
            }

             const music = data.rows.map(music =>
                new Music(
                    music.ID,
                    music.TITLE,
                    music.DATE,
                    music.TYPE,
                    music.ARTIST,
                    music.LABEL,
                    music.ASIN,
                ));
             return music[0];
        } catch (err) {
            console.log(`error: ${err}`);
            return null;
        }    
    }
    insert = async(item: Music): Promise<boolean> => {

        try {
            const queryCatalogItem = `
                INSERT INTO CATALOG_ITEM
                (TITLE, DATE)
                VALUES
                (?, ?);
            `;
            const queryMusic = `
                INSERT INTO MUSIC
                (TYPE, ARTIST, LABEL, ASIN)
                VALUES
                (?, ?, ?, ?);
            `;

             await DatabaseUtil.sendQuery(queryCatalogItem, [
                item.title,
                item.date]);

             await DatabaseUtil.sendQuery(queryMusic, [
                item.type,
                item.artist,
                item.label,
                item.asin]);
            
            return true;
        } catch (err) {
            console.log(`error: ${err}`);
            return null;
        }
    }
    update = async (item: Music): Promise<boolean> => {
            return false;       
    }
    delete = async (id:string): Promise<Music> => {
        return null;
    }
}
