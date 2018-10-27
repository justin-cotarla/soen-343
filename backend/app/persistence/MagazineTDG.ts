import { CatalogTDG } from './CatalogTDG';
import { Magazine } from '../models';
import DatabaseUtil from '../utility/DatabaseUtil';

class MagazineTDG extends CatalogTDG {

    find = async(id: string): Promise<Magazine> => {
        try {
            const query = `
                SELECT
                *
                FROM CATALOG_ITEM
                JOIN MAGAZINE
                ON CATALOG_ITEM.ID = MAGAZINE.CATALOG_ITEM_ID
                WHERE ID = ?
            `;

            const data = await DatabaseUtil.sendQuery(query, [id]);
            if (!data.rows.length) {
                return null;
            }

            const magazine = data.rows[0];
            return new Magazine(
                magazine.ID,
                magazine.TITLE,
                magazine.DATE,
                magazine.ISBN_10,
                magazine.ISBN_13,
                magazine.PUBLISHER,
                magazine.LANGUAGE,
            );
        } catch (err) {
            console.log(err);
        }
    }

    findAll = async (): Promise<Magazine[]> => {
        try {
            const query = `
            SELECT
            *
            FROM
            CATALOG_ITEM
            JOIN MAGAZINE
            ON ID = CATALOG_ITEM_ID
            `;
            const data = await DatabaseUtil.sendQuery(query);
            if (!data.rows.length) {
                return [];
            }

            return data.rows.map((magazine: any) => new Magazine(
                magazine.ID,
                magazine.TITLE,
                magazine.DATE,
                magazine.ISBN_10,
                magazine.ISBN_13,
                magazine.PUBLISHER,
                magazine.LANGUAGE,
                ));
        } catch (err) {
            console.log(err);
        }
    }

    insert = async (item: Magazine): Promise<Magazine> => {

        try {
            const queryMagazine = `
                INSERT
                INTO
                MAGAZINE
                (
                    ISBN_10,
                    ISBN_13,
                    PUBLISHER,
                    LANGUAGE,
                    CATALOG_ITEM_ID
                )
                VALUES
                (?, ?, ?, ?, ?);
            `;

            const catalogItem = await super.insert(item);

            await DatabaseUtil.sendQuery(queryMagazine, [
                item.isbn10.toString(),
                item.isbn13.toString(),
                item.publisher,
                item.language,
                catalogItem.id,
            ]);

            return new Magazine(
                catalogItem.id,
                catalogItem.title,
                catalogItem.date,
                item.isbn10,
                item.isbn13,
                item.publisher,
                item.language,
            );
        } catch (err) {
            console.log(err);
        }
    }

    update = async(item: Magazine): Promise<void> => {

        try {
            const query = `
                UPDATE
                CATALOG_ITEM
                JOIN MAGAZINE ON ID = CATALOG_ITEM_ID
                SET
                TITLE = ?,
                DATE = ?,
                ISBN_10 = ?,
                ISBN_13 = ?,
                PUBLISHER = ?,
                LANGUAGE = ?,
                WHERE CATALOG.ID = ?
            `;

            await DatabaseUtil.sendQuery(query, [
                item.title,
                item.date,
                item.isbn10.toString(),
                item.isbn13.toString(),
                item.publisher,
                item.language,
                item.id,
            ]);
        } catch (err) {
            console.log(err);
        }
    }

    delete = async(id: string): Promise<void> => {
        try {
            const query = `
                DELETE
                FROM MAGAZINE
                WHERE CATALOG_ITEM_ID = ?
            `;

            await DatabaseUtil.sendQuery(query, [id]);
            await super.delete(id);
        } catch (err) {
            console.log(err);
        }
    }
}

export default new MagazineTDG();
