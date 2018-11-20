import { Transaction, OperationType } from '../models/Transaction';
import { Client, InventoryItem } from '../models';
import { TransactionTDG } from '../persistence';

class Ledger {
    addTransaction = async (operation: OperationType, user: Client, item: InventoryItem) => {
        const transaction = new Transaction(
            undefined,
            new Date(),
            operation,
            user,
            item,
        );
        await TransactionTDG.insert(transaction);
    }

    viewTransactions = async (
        query: string,
        order: string,
        direction: string,
        timestamp: string,
        operation: OperationType,
        ) => {

    }
}

export default new Ledger();
