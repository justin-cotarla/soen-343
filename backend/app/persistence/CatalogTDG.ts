import { TableDataGateway } from './TableDataGateway';
import { CatalogItem } from '../models';
import DatabaseUtil from '../utility/DatabaseUtil';

export class CatalogTDG implements TableDataGateway {
    find = async (id: string) : Promise<CatalogItem> => {
        const query = `
            SELECT *
            FROM
            CATALOG_ITEM
            WHERE=?
        `;
        try {
            const data = await DatabaseUtil.sendQuery(query, [id]);
            if (!data.rows.length) {
                return null;
            }

            const item = data.rows[0];
            return new CatalogItem(item.ID, item.TITLE, item.DATE);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    findAll = async (): Promise<CatalogItem[]> => {
        try {
            const query = `
            SELECT
            *
            FROM
            CATALOG_ITEM
            `;
            const data = await DatabaseUtil.sendQuery(query);
            if (!data.rows.length) {
                return [];
            }

            return data.rows.map((item: any) => {
                new CatalogItem(item.ID, item.TITLE, item.DATE);
            });
        } catch (err) {
            console.log(err);
        }
    }

    insert = async (item: CatalogItem): Promise<CatalogItem> => {
        try {
            const queryCatalogItem = `
                INSERT INTO CATALOG_ITEM
                (TITLE, DATE)
                VALUES
                (?, ?)
            `;

            const result = await DatabaseUtil.sendQuery(queryCatalogItem, [
                item.title,
                item.date,
            ]);

            return new CatalogItem(
                result.rows.insertId,
                item.title,
                item.date,
            );
        } catch (err) {
            console.log(err);
        }
    }

    update = async (item: CatalogItem): Promise<void> => {
        try {
            const queryCatalogItem = `
                UPDATE
                CATALOG_ITEM
                SET TITLE = ?,
                DATE = ?
                WHERE ID = ?
            `;

            await DatabaseUtil.sendQuery(queryCatalogItem, [
                item.title,
                item.date,
                item.id,
            ]);
        } catch (err) {
            console.log(err);
        }
    }

    delete = async (id: string): Promise<void> => {
        try {
            const queryCatalogItem = `
                DELETE
                FROM CATALOG_ITEM
                WHERE ID = ?
            `;

            await DatabaseUtil.sendQuery(queryCatalogItem, [id]);
        } catch (err) {
            console.log(err);
        }
    }
}

export default new CatalogTDG();
