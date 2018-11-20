import 'jest';
import Ledger from '../services/Ledger';
import { OperationType } from '../models/Transaction';
import { TransactionTDG } from '../persistence';
import { Transaction, InventoryItem, Client } from '../models';

const userID = '323424';
const date = new Date('1542743443');
const mockUser = new Client(
    '432432',
    'Joe',
    'Jonas',
    5142323143,
    'joe@jonas.com',
    '45 hubble st',
    '42321',
);
const mockInventory = new InventoryItem(
    '10000',
    '12435',
    null,
    null,
);
const transactionMock = new Transaction(
    '21143',
    date,
    OperationType.LOAN,
    mockUser,
    mockInventory,
);

describe('Ledger', () => {
    describe('addTransaction', () => {
        TransactionTDG.insert = jest.fn();
        it('successfully adds a transaction', async () => {
            await Ledger.addTransaction(OperationType.LOAN, mockUser, mockInventory);
            expect(TransactionTDG.insert).toBeCalled();
        });
    });
    describe('viewTransactions', () => {
        it('successfully views transactions', async () => {
            Ledger.viewTransactions = jest.fn().
                mockReturnValueOnce([transactionMock]);
            const result = await Ledger.viewTransactions(
                'queryType',
                'time',
                'asc',
                date,
                'operationtype',
            );
            expect(result).toEqual([transactionMock]);
        });
        it('is unable to find corresponding transactions', async () => {
            Ledger.viewTransactions = jest.fn().
            mockReturnValueOnce([]);
            const result = await Ledger.viewTransactions(
                'queryType',
                'time',
                'asc',
                date,
                'operationtype',
            );
            expect(result).not.toEqual([transactionMock]);
        });
    });
});
