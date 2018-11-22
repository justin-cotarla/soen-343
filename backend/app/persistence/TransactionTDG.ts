import { TableDataGateway } from './TableDataGateway';
import { Transaction, Client, InventoryItem } from '../models';
import DatabaseUtil from '../utility/DatabaseUtil';
import { OperationType } from '../models/Transaction';

class TransactionTDG implements TableDataGateway {
    async find(id: string): Promise<Transaction> {
        const query = `
        SELECT
        *
        FROM
        TRANSACTION
        JOIN USER
        ON TRANSACTION.USER_ID = USER.ID
        JOIN INVENTORY_ITEM
        ON TRANSACTION.INVENTORY_ITEM_ID = INVENTORY_ITEM.ID
        WHERE TRANSACTION.ID = ?
        `;

        try {
            const data = await DatabaseUtil.sendQuery(query, [id]);
            if (!data.rows.length) {
                return null;
            }

            const item = data.rows[0];
            return new Transaction(
                item.ID,
                item.TIMESTAMP,
                item.OPERATION,
                new Client(
                    item.USER_ID,
                    item.FIRST_NAME,
                    item.LAST_NAME,
                    item.PHONE_NUMBER,
                    item.EMAIL,
                    item.ADDRESS,
                    null,
                ),
                new InventoryItem(
                    item.ID,
                    item.CATALOG_ITEM_ID,
                    item.LOANED_TO,
                    item.DUE_DATE,
                ),
            );
        } catch (err) {
            console.log(err);
        }
    }

    async findAll(query?: string, timestamp?: Date, operation?: string): Promise<Transaction[]> {
        try {
            const conditions = [];
            const values = [];

            if (query) {
                conditions.push(`
                (
                    USER.FIRST_NAME LIKE ? OR
                    USER.LAST_NAME LIKE ? OR
                    CATALOG_ITEM.TITLE LIKE ?
                )
                `);
                values.push(`%${query}%`, `%${query}%`, `%${query}%`);
            }
            if (timestamp) {
                conditions.push('TIMESTAMPDIFF(DAY, TRANSACTION.TIMESTAMP, ?) = 0');
                values.push(timestamp);
            }
            if (operation && Object.values(OperationType).includes(operation.toUpperCase())) {
                conditions.push('OPERATION = ?');
                values.push(operation);
            }

            const conditionsString = conditions.length ? conditions.join(' AND ') : 'TRUE';
            const queryString = `
                SELECT
                *
                FROM
                TRANSACTION
                JOIN USER
                ON TRANSACTION.USER_ID = USER.ID
                JOIN INVENTORY_ITEM
                ON TRANSACTION.INVENTORY_ITEM_ID = INVENTORY_ITEM.ID
                JOIN CATALOG_ITEM
                ON INVENTORY_ITEM.CATALOG_ITEM_ID = CATALOG_ITEM.ID
                WHERE ${conditionsString}
            `;

            const data = await DatabaseUtil.sendQuery(
                queryString,
                values,
            );
            if (!data.rows.length) {
                return [];
            }
            return data.rows.map((item: any) => new Transaction(
                item.ID,
                item.TIMESTAMP,
                item.OPERATION,
                new Client(
                    item.USER_ID,
                    item.FIRST_NAME,
                    item.LAST_NAME,
                    item.PHONE_NUMBER,
                    item.EMAIL,
                    item.ADDRESS,
                    null,
                ),
                new InventoryItem(
                    item.ID,
                    item.CATALOG_ITEM_ID,
                    item.LOANED_TO,
                    item.DUE_DATE,
                ),
            ));
        } catch (err) {
            console.log(err);
        }
    }

    async insert(item: Transaction): Promise<Transaction> {
        const query = `
        INSERT
        INTO
        TRANSACTION
        (
            TIMESTAMP,
            OPERATION,
            INVENTORY_ITEM_ID,
            USER_ID
        )
        VALUES
        (?, ?, ?, ?)
        `;

        try {
            const data = await DatabaseUtil.sendQuery(query, [
                item.timestamp,
                item.operation.toString(),
                item.inventoryItem.id,
                item.user.id,
            ]);

            return new Transaction(
                data.rows.insertId,
                item.timestamp,
                item.operation,
                item.user,
                item.inventoryItem,
            );
        } catch (err) {
            console.log(err);
        }
    }

    async update(item: Transaction): Promise<void> {
        const query = `
        UPDATE
        TRANSACTION
        SET
        TIMESTAMP = ?,
        OPERATION = ?,
        INVENTORY_ITEM_ID = ?,
        USER_ID = ?
        WHERE ID = ?
        `;

        try {
            await DatabaseUtil.sendQuery(query, [
                item.timestamp,
                item.operation.toString(),
                item.inventoryItem.id,
                item.user.id,
                item.id,
            ]);
        } catch (err) {
            console.log(err);
        }
    }

    async delete(id: string): Promise<void> {
        const query = `
        DELETE
        FROM
        TRANSACTION
        WHERE ID = ?
        `;

        try {
            await DatabaseUtil.sendQuery(query, [id]);
        } catch (err) {
            console.log(err);
        }
    }
}

export default new TransactionTDG();
