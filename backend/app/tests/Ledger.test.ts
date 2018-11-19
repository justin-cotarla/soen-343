import 'jest';
import Ledger from '../services/Ledger';
import { OperationType } from '../models/Transaction';
import { TransactionTDG } from '../persistence';

describe('Ledger', () => {
    describe('addTransaction', () => {
        TransactionTDG.insert = jest.fn();
        it('successfully adds a transaction', async () => {
            await Ledger.addTransaction(OperationType.LOAN, '1', '1');
            expect(TransactionTDG.insert).toBeCalled();
        });
    });
    describe('viewTransactions', () => {

    });
});
