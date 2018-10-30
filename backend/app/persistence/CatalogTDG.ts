import { TableDataGateway } from './TableDataGateway';
import { CatalogItem } from '../models';
import DatabaseUtil from '../utility/DatabaseUtil';

export class CatalogTDG implements TableDataGateway {
    async find(id: string) : Promise<CatalogItem> {
        const query = `
            SELECT *
            FROM
            CATALOG_ITEM
            WHERE ID = ?
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
        }
    }

    async findAll(): Promise<CatalogItem[]> {
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

    async insert(item: CatalogItem): Promise<CatalogItem> {
        try {
            const query = `
                INSERT INTO CATALOG_ITEM
                (TITLE, DATE)
                VALUES
                (?, ?)
            `;

            const result = await DatabaseUtil.sendQuery(query, [
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

    async update(item: CatalogItem): Promise<void> {
        try {
            const query = `
                UPDATE
                CATALOG_ITEM
                SET TITLE = ?,
                DATE = ?
                WHERE ID = ?
            `;

            await DatabaseUtil.sendQuery(query, [
                item.title,
                item.date,
                item.id,
            ]);
        } catch (err) {
            console.log(err);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const query = `
                DELETE
                FROM CATALOG_ITEM
                WHERE ID = ?
            `;

            await DatabaseUtil.sendQuery(query, [id]);
        } catch (err) {
            console.log(err);
        }
    }
}

export default new CatalogTDG();
