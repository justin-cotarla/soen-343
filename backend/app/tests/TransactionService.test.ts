import 'jest';
import { Cart} from '../models';
import TransactionService from '../services/TransactionService';

const carts = new Map<string, Cart>();
const userID = '323424';

beforeEach(async () => {
    jest.clearAllMocks();
});

describe('TransactionService', () => {
    describe('cancelTransaction', () => {
        it('successfully deletes cart', async () => {
            TransactionService.carts.delete = jest.fn().mockReturnValueOnce(true);
            const result = await TransactionService.cancelTransaction('321321');
            expect(result).toBe(true);
        });
        it('does not delete cart', async () => {
            TransactionService.carts.delete = jest.fn().mockReturnValueOnce(false);
            const result = await TransactionService.cancelTransaction('3214213');
            expect(result).toBe(false);
        });
    });
});
