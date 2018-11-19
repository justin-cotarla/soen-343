import { TableDataGateway } from './TableDataGateway';
import { Transaction } from '../models';
import DatabaseUtil, { QueryResponse } from '../utility/DatabaseUtil';

class TransactionTDG implements TableDataGateway {
    async find(id: string): Promise<Transaction> {
        const query = `
        SELECT
        *
        FROM
        TRANSACTION
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
                item.USER_ID,
                item.INVENTORY_ITEM_ID,
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
                WHERE ID LIKE ? OR
                    USER_ID LIKE ? OR
                    INVENTORY_ITEM_ID LIKE ?
                `;
                data = await DatabaseUtil.sendQuery(queryString, [
                    query,
                    query,
                    query,
                ]);
            } else if (!query && timestamp && !operation) {
                // SEARCHING BY TIMESTAMP WILL RETURN RESULTS ON AND BEFORE THE DATE
                queryString = `
                SELECT
                *
                FROM
                TRANSACTION
                WHERE TIMESTAMP <= ?
                `;
                data = await DatabaseUtil.sendQuery(queryString, [timestamp]);
            } else if (!query && !timestamp && operation) {
                queryString = `
                SELECT
                *
                FROM
                TRANSACTION
                WHERE OPERATION = ?
                `;
                data = await DatabaseUtil.sendQuery(queryString, [operation]);
            } else if (query && timestamp && !operation) {
                queryString = `
                SELECT
                *
                FROM
                TRANSACTION
                WHERE ID LIKE ? OR
                    USER_ID LIKE ? OR
                    INVENTORY_ITEM_ID LIKE ? AND
                    TIMESTAMP <= ?
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
                WHERE ID LIKE ? OR
                    USER_ID LIKE ? OR
                    INVENTORY_ITEM_ID LIKE ? AND
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
                WHERE TIMESTAMP <= ? AND
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
                WHERE ID LIKE ? OR
                    USER_ID LIKE ? OR
                    INVENTORY_ITEM_ID LIKE ? AND
                    TIMESTAMP <= ? AND
                    OPERATION = ?
                `;
                DatabaseUtil.sendQuery(queryString, [
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
                item.USER_ID,
                item.INVENTORY_ITEM_ID,
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
                item.inventoryItemId,
                item.userId,
            ]);

            return new Transaction(
                data.rows.insertId,
                item.timestamp,
                item.operation,
                item.userId,
                item.inventoryItemId,
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
                item.inventoryItemId,
                item.userId,
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
