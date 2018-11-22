import { TableDataGateway } from './TableDataGateway';
import { InventoryItem } from '../models';
import DatabaseUtil from '../utility/DatabaseUtil';

class InventoryTDG implements TableDataGateway {
    async find(id: string): Promise<InventoryItem> {
        const query = `
            SELECT *
            FROM
            INVENTORY_ITEM
            WHERE ID = ?
        `;
        try {
            const data = await DatabaseUtil.sendQuery(query, [id]);
            if (!data.rows.length) {
                return null;
            }

            const item = data.rows[0];
            return new InventoryItem(
                item.ID,
                item.CATALOG_ITEM_ID,
                item.LOANED_TO,
                item.DUE_DATE,
            );
        } catch (err) {
            console.log(err);
        }
    }

    async findAll(catalogItemId?: string, userId?: string): Promise<InventoryItem[]> {

        try {
            const conditions = [];
            const values = [];

            if (catalogItemId) {
                conditions.push('CATALOG_ITEM_ID = ?');
                values.push(catalogItemId);
            }

            if (userId) {
                conditions.push('LOANED_TO = ?');
                values.push(userId);
            }

            const conditionString = conditions.length ? conditions.join(' AND ') : 'TRUE';
            const queryString = `
                SELECT
                *
                FROM
                INVENTORY_ITEM
                WHERE ${conditionString}
                `;

            const data = await DatabaseUtil.sendQuery(
                queryString,
                values,
            );
            if (!data.rows.length) {
                return [];
            }

            return data.rows.map((item: any) => new InventoryItem(
                item.ID,
                item.CATALOG_ITEM_ID,
                item.LOANED_TO,
                item.DUE_DATE,
            ));

        } catch (err) {
            console.log(err);
        }
    }

    async insert(item: InventoryItem): Promise<InventoryItem> {
        try {
            const query = `
                INSERT
                INTO
                INVENTORY_ITEM
                (
                    CATALOG_ITEM_ID,
                    LOANED_TO,
                    DUE_DATE
                )
                VALUES
                (?, ?, ?);
            `;

            const data = await DatabaseUtil.sendQuery(query, [
                item.catalogItemId,
                item.loanedTo,
                item.dueDate,
            ]);

            return new InventoryItem(
                data.rows.insertId,
                item.catalogItemId,
                item.loanedTo,
                item.dueDate,
            );
        } catch (err) {
            console.log(err);
        }
    }

    async update(item: InventoryItem): Promise<void> {
        try {
            const query = `
                UPDATE
                INVENTORY_ITEM
                SET
                LOANED_TO = ?,
                DUE_DATE = ?
                WHERE ID = ?
            `;

            await DatabaseUtil.sendQuery(query, [
                item.loanedTo,
                item.dueDate,
                item.id,
            ]);
        } catch (err) {
            console.log(err);
        }
    }

    async loan(items: InventoryItem[]): Promise<void> {
        try {
            let itemIds = '';
            items.forEach((_, i) => {
                return i === items.length - 1 ?
                    itemIds += 'ID = ?' :
                    itemIds += 'ID = ? AND ';
            });

            const query = `
                UPDATE
                INVENTORY_ITEM
                SET
                LOANED_TO = ?
                WHERE ${itemIds}
            `;

            await DatabaseUtil.sendQuery(query, [items[0].loanedTo, ...items.map(i => i.id)]);

        } catch (err) {
            console.log(err);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const query = `
                DELETE
                FROM
                INVENTORY_ITEM
                WHERE ID = ?
                `;
            await DatabaseUtil.sendQuery(query, [id]);
        } catch (err) {
            console.log(err);
        }
    }

    async deleteAll(catalogItemId: string): Promise<void> {
        try {
            const query = `
                DELETE
                FROM
                INVENTORY_ITEM
                WHERE CATALOG_ITEM_ID = ?
                `;
            await DatabaseUtil.sendQuery(query, [catalogItemId]);
        } catch (err) {
            console.log(err);
        }
    }

}

export default new InventoryTDG();
