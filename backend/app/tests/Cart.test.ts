import 'jest';
import { Cart } from '../models';

const mockCart = new Cart([
    '1',
    '2',
    '4',
    '5',
]);

const mockNewCart = new Cart([
    '5',
    '4',
    '3',
    '2',
    '1',
]);

beforeEach(async () => {
    jest.clearAllMocks();
});

describe('Cart', () => {
    describe('getItems', () => {
        it('successfully view items', async () => {
            const result = await mockCart.getItems();
            expect(result).toEqual(mockCart.items);
            expect(result.length).toEqual(mockCart.size);
        });
    });

    describe('update', () => {
        it('successfully update cart items', async () => {
            await mockCart.update([
                '5',
                '4',
                '3',
                '2',
                '1',
            ]);
            expect(mockCart).toEqual(mockNewCart);
            expect(mockCart.size).toEqual(mockNewCart.size);
        });
    });
});
