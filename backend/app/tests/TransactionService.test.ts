import 'jest';
import TransactionService from '../services/TransactionService';
import Ledger from '../services/Ledger';
import { OperationType } from '../models/Transaction';
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

beforeEach(async () => {
    jest.clearAllMocks();
});

describe('TransactionService', () => {
    describe('cancelTransaction', () => {
        it('successfully deletes cart', async () => {
            TransactionService.carts.delete = jest.fn().mockReturnValueOnce(true);
            const result = await TransactionService.cancelTransaction(userID);
            expect(result).toBe(true);
        });
        it('does not delete cart', async () => {
            TransactionService.carts.delete = jest.fn().mockReturnValueOnce(false);
            const result = await TransactionService.cancelTransaction(userID);
            expect(result).toBe(false);
        });
    });
    describe('viewTransactions', () => {
        it('successfully views transactions', async () => {
            Ledger.viewTransactions = jest.fn().mockReturnValueOnce([transactionMock]);
            const result = await TransactionService.viewTransactions(
                'queryType',
                'time',
                'asc',
                '12332543543',
                'operationtype',
            );
            expect(result).toEqual([transactionMock]);
        });
        it('is unable to find corresponding transactions', async () => {
            Ledger.viewTransactions = jest.fn().mockReturnValueOnce([]);
            const result = await TransactionService.viewTransactions(
                'queryType',
                'time',
                'asc',
                '12332543543',
                'operationtype',
            );
            expect(result).not.toEqual([transactionMock]);
        });
    });
});
