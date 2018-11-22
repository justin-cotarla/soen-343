import { Transaction, OperationType } from '../models/Transaction';
import { Client, InventoryItem } from '../models';
import { TransactionDAO } from '../persistence';

class Ledger {
    addTransaction = async (operation: OperationType, user: Client, item: InventoryItem) => {
        const transaction = new Transaction(
            undefined,
            new Date(),
            operation,
            user,
            item,
        );
        await TransactionDAO.insert(transaction);
    }

    async viewTransactions(
        query: string,
        order: string,
        direction: string,
        timestamp: Date,
        operation: string,
    ) : Promise<Transaction[]> {
        const transactions = await TransactionDAO.findAll(query, timestamp, operation);

        if (order === 'time' && direction === 'asc') {
            transactions.sort((a, b) =>
                (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0));
        }
        if (order === 'date' && direction === 'asc') {
            transactions.sort((a, b) =>
                (a.inventoryItem.dueDate > b.inventoryItem.dueDate) ?
                    1 : ((b.inventoryItem.dueDate > a.inventoryItem.dueDate) ? -1 : 0));
        }
        if (order === 'time' && direction === 'desc') {
            transactions.sort((a, b) =>
                (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0));
        }
        if (order === 'date' && direction === 'desc') {
            transactions.sort((a, b) =>
                (a.inventoryItem.dueDate > b.inventoryItem.dueDate) ?
                    1 : ((b.inventoryItem.dueDate > a.inventoryItem.dueDate) ? -1 : 0));
        }

        return transactions;
    }
}

export default new Ledger();
