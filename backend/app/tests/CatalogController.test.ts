import 'jest';
import supertest from 'supertest';

import server from '../server';
import { BookFormat } from '../models/Book';
import { Administrator, Magazine, InventoryItem } from '../models';
import { generateToken } from '../utility/AuthUtil';

import Catalog from '../services/Catalog';

// Must create a fake token to pass auth check
let token: string;
beforeEach(async () => {
    process.env.JWT_KEY = 'test';
    const profile: Administrator = new Administrator('Test', 'Test', 0, 'Test', 'Test');
    token = await generateToken({ profile, isAdmin: true });
});

describe('CatalogRouter', () => {
    describe('PUT /catalog', () => {
        afterEach(() => {
            Catalog['catalogItems'] = new Map();
        });

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
            expect(response.body.inventory.length).toEqual(3);
        });
    });

    describe('GET /catalog', () => {
        beforeEach(() => {
            const catalogItemId = 'test';
            const magazine:Magazine = new Magazine(
                 catalogItemId,
                 'Popular Mechanics',
                 'Test Date',
                 123,
                 123,
                 'Test Pub',
                 'English',
            );

            Catalog['catalogItems'].set(magazine, []);
        });

        it('Returns a list of all catalog items', async () => {
            const response = await supertest(server)
                .get('/catalog')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(response.body.length).toEqual(1);
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

            Catalog['catalogItems'].set(magazine, []);
        });

        afterEach(() => {
            Catalog['catalogItems'] = new Map();
        });

        it('requires admin rights', async () => {
            await supertest(server)
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

    describe('DELETE /catalog/:id', () => {
        beforeAll(() => {
            const magazine:Magazine = new Magazine(
                 '1',
                 'Popular Mechanics',
                 'Test Date',
                 123,
                 123,
                 'Test Pub',
                 'English',
            );

            Catalog['catalogItems'].set(magazine, []);
        });

        it('requires admin rights', async () => {
            await supertest(server)
                .delete('/catalog/1')
                .expect(403);
        });

        it('throws an error if trying to delete a non-existing catalog item', async (done) => {
            supertest(server)
                .delete('/catalog/dne')
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(404)
                .end((err: any, res: any) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('successfully deletes a catalog item', async () => {
            await supertest(server)
                .delete('/catalog/1')
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(200);

            expect(Catalog['catalogItems'].size).toEqual(0);
        });
    });

    describe('DELETE /catalog/:id/inventory', () => {
        const magazine:Magazine = new Magazine(
            '1',
            'Popular Mechanics',
            'Test Date',
            123,
            123,
            'Test Pub',
            'English',
        );
        const inventory = [
            new InventoryItem('1', magazine, false),
            new InventoryItem('2', magazine, true),
        ];
        beforeAll(() => {
            Catalog['catalogItems'].set(magazine, inventory);
        });

        it('requires admin rights', async () => {
            await supertest(server)
                .delete('/catalog/1/inventory')
                .expect(403);
        });

        it('throws an error if trying to delete from a non-existing catalog item', async (done) => {
            supertest(server)
                .delete('/catalog/dne/inventory')
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(404)
                .end((err: any, res: any) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('deletes an available inventory item for a specific catalog item', async () => {
            await supertest(server)
                .delete('/catalog/1/inventory')
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(200);

            expect(Catalog['catalogItems'].get(magazine).length).toEqual(1);
        });

        it('will not delete an unavailable inventory item', async (done) => {
            supertest(server)
                .delete('/catalog/1/inventory')
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(404)
                .end((err: any, res: any) => {
                    if (err) return done(err);
                    done();
                });

            expect(Catalog['catalogItems'].get(magazine).length).toEqual(1);
        });

    });
});
