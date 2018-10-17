import 'jest';
import supertest from 'supertest';

import server from '../server';
import { BookFormat } from '../models/Book';
import { Administrator, Magazine } from '../models';
import { generateToken } from '../utility/AuthUtil';

import CatalogService from '../controllers/CatalogService';

// Must create a fake token to pass auth check
let token: string;
beforeEach(async () => {
    process.env.JWT_KEY = 'test';
    const profile: Administrator = new Administrator('Test', 'Test', 0, 'Test', 'Test');
    token = await generateToken({ profile, isAdmin: true });
});

describe('CatalogRouter', () => {
    describe('PUT /catalog', () => {
        it('requires admin rights', async () => {
            supertest(server)
                .put('/catalog')
                .expect(403);
        });

        it('does not accept empty requests', async (done) => {
            supertest(server)
                .put('/catalog/book')
                .set('Authorization', `Bearer ${token}`)
                .send({})
                .expect(401)
                .end((err: any, res: any) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('throws an error if a single attribute is missing', async (done) => {
            const invalidRequest = {
                catalogItem: {
                    title: 'TestBook',
                    date: 'TestDate',
                    isbn10: 1234567890,
                    isbn13: 123456789012,
                    author: 'TestAuthor',
                    publisher: 'TestPublisher',
                    format: BookFormat.HardCover,
                },
                quantity: 1,
            };
            supertest(server)
                .put('/catalog/book')
                .set('Authorization', `Bearer ${token}`)
                .send(invalidRequest)
                .expect(401)
                .end((err: any, res: any) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Creates a catalog item of the specified type', async () => {
            const bookRequest = {
                catalogItem: {
                    title: 'TestBook',
                    date: 'TestDate',
                    isbn10: 1234567890,
                    isbn13: 123456789012,
                    author: 'TestAuthor',
                    publisher: 'TestPublisher',
                    format: BookFormat.HardCover,
                    pages: 69,
                },
                quantity: 1,
            };

            const response = await supertest(server)
                .put('/catalog/book')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send(bookRequest)
                .expect(200);
            console.log(response.body);
        });

        it('Creates the specified quantity of inventory items', async () => {
            const magazineRequest = {
                catalogItem: {
                    title: 'TestMagazine',
                    date: 'TestDate',
                    isbn10: 1234567890,
                    isbn13: 123456789012,
                    publisher: 'TestPublisher',
                    language: 'English',
                },
                quantity: 3,
            };

            const response = await supertest(server)
                .put('/catalog/magazine')
                .send(magazineRequest)
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .expect(200);
            console.log(response.body);
            expect(response.body.inventory.length).toEqual(3);
        });
    });

    describe('GET /catalog', () => {
        it('Returns a list of all catalog items', async () => {
            const bookRequest = {
                catalogItem: {
                    title: 'TestBook',
                    date: 'TestDate',
                    isbn10: 1234567890,
                    isbn13: 123456789012,
                    author: 'TestAuthor',
                    publisher: 'TestPublisher',
                    format: BookFormat.HardCover,
                    pages: 69,
                },
                quantity: 1,
            };

            // Add book to inventory
            await supertest(server)
                .put('/catalog/book')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send(bookRequest)
                .expect(200);

            const response = await supertest(server)
                .get('/catalog')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            console.log(response.body);
        });
    });

    describe('PUT /catalog/:catalogItemId/inventory', () => {
        const catalogItemId = 'test';

        beforeAll(() => {
            // jest.mock('uuid');
            // (uuid.v4 as any).mockResolvedValue('hello');
            jest.unmock('uuid/v4');
            let v4 = require.requireActual('uuid/v4');
            v4 = jest.fn();
        });

        beforeEach(() => {
            const magazine:Magazine = new Magazine(
                 catalogItemId,
                 'Popular Mechanics',
                 'Test Date',
                 123,
                 123,
                 'Test Pub',
                 'English',
            );

            CatalogService['catalogItems'].set(magazine, []);
        });

        afterEach(() => {
            CatalogService['catalogItems'] = new Map();
        });

        it('requires admin rights', async () => {
            supertest(server)
                .put(`/catalog/${catalogItemId}/inventory`)
                .expect(403);
        });

        it('throws an error if a non-existing catalogItem is requested', async (done) => {
            supertest(server)
                .put('/catalog/bad/inventory')
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(404)
                .end((err: any, res: any) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('successfully adds an inventory item', async () => {
            const response = await supertest(server)
            .put(`/catalog/${catalogItemId}/inventory`)
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(200);

            expect(response.body.id).toHaveLength(36);
        });
    });
});
