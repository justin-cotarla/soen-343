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
            return new InventoryItem(item.ID, item.CATALOG_ITEM_ID, item.AVAILABLE);
        } catch (err) {
            console.log(err);
        }
    }

    async findAll(catalogItemId: string): Promise<InventoryItem[]> {
        try {
            const query = `
            SELECT
            *
            FROM
            INVENTORY_ITEM
            WHERE CATALOG_ITEM_ID = ?
            `;
            const data = await DatabaseUtil.sendQuery(query, [catalogItemId]);
            if (!data.rows.length) {
                return [];
            }

            return data.rows.map((item: any) => new InventoryItem(
                item.ID,
                catalogItemId,
                item.AVAILABLE,
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
                    AVAILABLE,
                    CATALOG_ITEM_ID
                )
                VALUES
                (?, ?);
            `;

            const data = await DatabaseUtil.sendQuery(query, [
                item.available ? '1' : '0',
                item.catalogItemId,
            ]);

            return new InventoryItem(
                data.rows.insertId,
                item.catalogItemId,
                item.available,
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
                AVAILABLE = ?,
                WHERE ID = ?
            `;

            await DatabaseUtil.sendQuery(query, [
                item.available ? '1' : '0',
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