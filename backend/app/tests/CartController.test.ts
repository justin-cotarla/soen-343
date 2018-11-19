import 'jest';
import supertest from 'supertest';

import server from '../server';
import { Administrator, Client, InventoryItem, Cart } from '../models';
import { generateToken } from '../utility/AuthUtil';

import TransactionService from '../services/TransactionService';

jest.mock('../middlewares/injectUser');

// Must create a fake tokens for auth checks
let clientToken: string;
let adminToken: string;

beforeAll(() => {
    console.log = jest.fn();
});

beforeEach(async () => {
    process.env.JWT_KEY = 'test';
    const admin: Administrator = new Administrator(
        '1',
        'Test',
        'Test',
        0,
        'Test',
        'Test',
        '12345',
    );
    const client: Client = new Client(
        '2',
        'Test',
        'Test',
        0,
        'Test',
        'Test',
        '12345',
    );

    adminToken = await generateToken({ user: admin, isAdmin: true });
    clientToken = await generateToken({ user: client, isAdmin: false });
    jest.clearAllMocks();
});

describe('CartController', () => {
    describe('GET /cart/:id', () => {
        const cart = new Cart(5);
        cart.items.set('1', 3);

        beforeAll(() => {
            TransactionService['carts'].set('2', cart);
        });

        it('Cannot be accessed by administrators', async () => {
            await supertest(server)
                .get('/cart/1')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(403);
        });

        it('Requires the :id param', async () => {
            await supertest(server)
                .get('/cart')
                .set('Authorization', `Bearer ${clientToken}`)
                .expect(404);
        });

        it('Throws an error if a user attempts to access a cart other than their own', async () => {
            await supertest(server)
                .get('/cart/3')
                .set('Authorization', `Bearer ${clientToken}`)
                .expect(403);
        });

        it('Returns a list of inventory items', async () => {
            const response = await supertest(server)
                .get('/cart/2')
                .set('Authorization', `Bearer ${clientToken}`)
                .expect(200);

            expect(response.body.cart.length).toEqual(1);
        });

        it('Does not modify the contents of the requested cart', async () => {
            const response = await supertest(server)
                .get('/cart/2')
                .set('Authorization', `Bearer ${clientToken}`)
                .expect(200);

            expect(response.body.cart).toEqual([{ catalogItemId: '1', quantity: 3 }]);
        });
    });
});
