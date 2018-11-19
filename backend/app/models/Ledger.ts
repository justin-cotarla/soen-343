import { Transaction, OperationType } from './Transaction';
import { TransactionTDG } from '../persistence';

class Ledger {
    addTransaction = async (operation: OperationType, userId: string, itemId: string) => {
        const transaction = new Transaction(
            undefined,
            Date.now().toString(),
            operation,
            userId,
            itemId,
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
