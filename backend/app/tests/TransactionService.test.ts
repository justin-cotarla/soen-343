import 'jest';
import TransactionService from '../services/TransactionService';

const userID = '323424';

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
});
