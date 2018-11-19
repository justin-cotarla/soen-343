import { TableDataGateway } from './TableDataGateway';
import { Transaction, Client, InventoryItem } from '../models';
import DatabaseUtil, { QueryResponse } from '../utility/DatabaseUtil';

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
        WHERE ID = ?
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
                    item.SESSION_ID,
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

    async findAll(query?: string, timestamp?: string, operation?: string): Promise<Transaction[]> {
        try {
            let data: QueryResponse;
            let queryString: string;

            if (query && !timestamp && !operation) {
                queryString = `
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
                WHERE USER.FIRST_NAME LIKE ? OR
                    USER.LAST_NAME LIKE ? OR
                    CATALOG_ITEM.TITLE LIKE ?
                `;
                data = await DatabaseUtil.sendQuery(queryString, [
                    query,
                    query,
                    query,
                ]);
            } else if (!query && timestamp && !operation) {
                // SEARCHING BY TIMESTAMP WILL RETURN RESULTS ON THAT DAY
                queryString = `
                SELECT
                *
                FROM
                TRANSACTION
                JOIN USER
                ON TRANSACTION.USER_ID = USER.ID
                JOIN INVENTORY_ITEM
                ON TRANSACTION.INVENTORY_ITEM_ID = INVENTORY_ITEM.ID
                WHERE TIMESTAMPDIFF(DAY, TIMESTAMP, ?) = 0
                `;
                data = await DatabaseUtil.sendQuery(queryString, [timestamp]);
            } else if (!query && !timestamp && operation) {
                queryString = `
                SELECT
                *
                FROM
                TRANSACTION
                JOIN USER
                ON TRANSACTION.USER_ID = USER.ID
                JOIN INVENTORY_ITEM
                ON TRANSACTION.INVENTORY_ITEM_ID = INVENTORY_ITEM.ID
                WHERE OPERATION = ?
                `;
                data = await DatabaseUtil.sendQuery(queryString, [operation]);
            } else if (query && timestamp && !operation) {
                queryString = `
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
                WHERE USER.FIRST_NAME LIKE ? OR
                    USER.LAST_NAME LIKE ? OR
                    CATALOG_ITEM.TITLE LIKE ? AND
                    TIMESTAMPDIFF(DAY, TIMESTAMP, ?) = 0
                `;
                data = await DatabaseUtil.sendQuery(queryString, [
                    query,
                    query,
                    query,
                    timestamp,
                ]);
            } else if (query && !timestamp && operation) {
                queryString = `
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
                WHERE USER.FIRST_NAME LIKE ? OR
                    USER.LAST_NAME LIKE ? OR
                    CATALOG_ITEM.TITLE LIKE ? AND
                    OPERATION = ?
                `;
                data = await DatabaseUtil.sendQuery(queryString, [
                    query,
                    query,
                    query,
                    operation,
                ]);
            } else if (!query && timestamp && operation) {
                queryString = `
                SELECT
                *
                FROM
                TRANSACTION
                JOIN USER
                ON TRANSACTION.USER_ID = USER.ID
                JOIN INVENTORY_ITEM
                ON TRANSACTION.INVENTORY_ITEM_ID = INVENTORY_ITEM.ID
                WHERE TIMESTAMPDIFF(DAY, TIMESTAMP, ?) = 0 AND
                    OPERATION = ?
                `;
                data = await DatabaseUtil.sendQuery(queryString, [
                    timestamp,
                    operation,
                ]);
            } else if (query && timestamp && operation) {
                queryString = `
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
                WHERE USER.FIRST_NAME LIKE ? OR
                    USER.LAST_NAME LIKE ? OR
                    CATALOG_ITEM.TITLE LIKE ? AND
                    TIMESTAMPDIFF(DAY, TIMESTAMP, ?) = 0 AND
                    OPERATION = ?
                `;
                data = await DatabaseUtil.sendQuery(queryString, [
                    query,
                    query,
                    query,
                    timestamp,
                    operation,
                ]);
            } else {
                queryString = `
                SELECT
                *
                FROM
                TRANSACTION
                JOIN USER
                ON TRANSACTION.USER_ID = USER.ID
                JOIN INVENTORY_ITEM
                ON TRANSACTION.INVENTORY_ITEM_ID = INVENTORY_ITEM.ID
                `;
                data = await DatabaseUtil.sendQuery(queryString);
            }

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
                    item.SESSION_ID,
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
        TRANSACTIONS
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
