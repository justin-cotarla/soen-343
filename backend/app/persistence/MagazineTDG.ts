import { TableDataGateway } from './TableDataGateway';
import { Magazine } from '../models';
import DatabaseUtil from '../utility/DatabaseUtil';


class MagazineTDG implements TableDataGateway{

    find = async(id: string): Promise<Magazine> => {
        try {
            const query = `
                SELECT
                ID, TITLE, DATE, ISBN_10, ISBN_13, PUBLISHER, LANGUAGE
                FROM CATALOG_ITEM
                INNER JOIN MAGAZINE ON CATALOG_ITEM.ID = MAGAZINE.CATALOG_ITEM_ID
                WHERE ID = ?
            `;

            const data = await DatabaseUtil.sendQuery(query, [id]);
            if (!data.rows.length) {
                return null;
            }
            const magazines = data.rows.map(magazine =>
                new Magazine(
                    magazine.ID,
                    magazine.TITLE,
                    magazine.DATE,
                    magazine.ISBN_10,
                    magazine.ISBN_13,
                    magazine.PUBLISHER,
                    magazine.LANGUAGE,
                ));
            return magazines[0];
        } catch (err) {
            console.log('Error: ${err}');
            return null;
        }
    };

    insert = async (item: Magazine): Promise<boolean> => {

        try{

            const queryCatalogItem = `
                 INSERT INTO CATALOG_ITEM
                 (TITLE, DATE)
                 VALUES
                 (?, ?)
            `;

            const queryMagazine = `
                INSERT INTO MAGAZINE
                (ISBN_10, ISBN_13, PUBLISHER, LANGUAGE, CATALOG_ITEM_ID)
                VALUES
                (?, ?, ?, ?, ?);
            `;

            await DatabaseUtil.sendQuery(queryCatalogItem, [
                item.title,
                item.date,
            ]);

            await DatabaseUtil.sendQuery(queryMagazine, [
                item.isbn10.toString(),
                item.isbn13.toString(),
                item.publisher,
                item.language,
                item.id,
            ]);
            return true;
        } catch(err){
            console.log('Error: ${err}');
            return false;
        }
    };

    update = async(item: Magazine): Promise<boolean> => {

        try{

            const queryCatalogItem = `
                 UPDATE
                 CATALOG_ITEM
                 SET TITLE = ?,
                 DATE = ?
                 WHERE ID = ?
            `;

            const queryMagazine = `
                 UPDATE
                 MAGAZINE
                 ISBN_10 = ?,
                 ISBN_13 = ?,
                 PUBLISHER = ?,
                 LANGUAGE = ?,
                 WHERE CATALOG_ITEM_ID = ?
             `;

            await DatabaseUtil.sendQuery(queryCatalogItem, [
                item.title,
                item.date,
                item.id,
            ]);

            await DatabaseUtil.sendQuery(queryMagazine, [
                item.isbn10.toString(),
                item.isbn13.toString(),
                item.publisher,
                item.language,
                item.id,
            ]);
            return true;
        } catch(err){
            console.log('Error: ${err}');
            return false;
        }

    };

    delete = async(id: string): Promise<Magazine> => {

        const foundMagazine = await this.find(id);

        if(foundMagazine){
            try {

                const queryCatalogItem = `
                     DELETE
                     FROM CATALOG_ITEM
                     WHERE ID = ?
                `;

                const queryMagazine = `
                     DELETE
                     FROM MAGAZINE
                     WHERE CATALOG_ITEM_ID = ?
                 `;

                await DatabaseUtil.sendQuery(queryCatalogItem, [id]);
                await DatabaseUtil.sendQuery(queryMagazine, [id]);
                return foundMagazine;

            } catch(err){
                console.log('Error: ${err}');
                return null;
            }
        }
        return null;
    };
}
