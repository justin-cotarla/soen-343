import 'jest';
import supertest from 'supertest';

import server from '../server';
import { BookFormat, Book } from '../models/Book';
import { Administrator, Magazine, InventoryItem, CatalogItem } from '../models';
import { generateToken } from '../utility/AuthUtil';

import Catalog from '../services/Catalog';

// Must create a fake token to pass auth check
let token: string;
beforeEach(async () => {
    process.env.JWT_KEY = 'test';
    const user: Administrator = new Administrator(
        '1',
        'Test',
        'Test',
        0,
        'Test',
        'Test',
        '12345',
    );
    token = await generateToken({ user, isAdmin: true });
    jest.clearAllMocks();
});

describe('CatalogRouter', () => {
    describe('PUT /catalog', () => {
        it('requires admin rights', async () => {
            await supertest(server)
                .put('/catalog/book')
                .expect(403);
        });

        it('handles invalid type', async (done) => {
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

            supertest(server)
                .put('/catalog/invalid')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send(bookRequest)
                .expect(400)
                .end((err: any, res: any) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('does not accept empty requests', async (done) => {
            supertest(server)
                .put('/catalog/book')
                .set('Authorization', `Bearer ${token}`)
                .send({})
                .expect(400)
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
                .expect(400)
                .end((err: any, res: any) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('handles bad request', async (done) => {
            Catalog.addItem = jest.fn(() => {
                throw new Error();
            });
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

            supertest(server)
                .put('/catalog/book')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send(bookRequest)
                .expect(500)
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

            const insertedItem: Book = {
                id: '1',
                title: 'TestBook',
                date: 'TestDate',
                isbn10: 1234567890,
                isbn13: 123456789012,
                author: 'TestAuthor',
                publisher: 'TestPublisher',
                format: BookFormat.HardCover,
                pages: 69,
            };

            Catalog.addItem = jest.fn().mockReturnValueOnce({
                catalogItem: insertedItem,
                inventory: [new InventoryItem('1', insertedItem.id, true)],
            });

            const response = await supertest(server)
                .put('/catalog/book')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send(bookRequest)
                .expect(200);

            expect(response.body.catalogItem).toEqual(insertedItem);
            expect(response.body.inventory.length).toEqual(1);
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

            const insertedItem: Magazine = {
                id: '1',
                title: 'TestMagazine',
                date: 'TestDate',
                isbn10: 1234567890,
                isbn13: 123456789012,
                publisher: 'TestPublisher',
                language: 'English',
            };

            Catalog.addItem = jest.fn().mockReturnValueOnce({
                catalogItem: insertedItem,
                inventory: [
                    new InventoryItem('1', insertedItem.id, true),
                    new InventoryItem('2', insertedItem.id, true),
                    new InventoryItem('3', insertedItem.id, true),
                ],
            });

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
        const magazine: Magazine = new Magazine(
            'test',
            'Popular Mechanics',
            'Test Date',
            123,
            123,
            'Test Pub',
            'English',
        );

        it('requires authenticated user', async () => {
            await supertest(server)
                .get('/catalog')
                .expect(401);
        });
        it('Returns a list of all catalog items', async () => {
            Catalog.viewItems = jest.fn().mockReturnValueOnce([magazine]);
            const response = await supertest(server)
                .get('/catalog')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(response.body.length).toEqual(1);
        });
        it('handles bad request error', async () => {
            Catalog.viewItems = jest.fn(() => {
                throw new Error();
            });
            await supertest(server)
                .get('/catalog')
                .set('Authorization', `Bearer ${token}`)
                .expect(400);
        });
    });

    describe('GET /catalog/:type', () => {
        const magazine: Magazine = new Magazine(
            'test',
            'Popular Mechanics',
            'Test Date',
            123,
            123,
            'Test Pub',
            'English',
        );

        it('requires authenticated user', async () => {
            await supertest(server)
                .get('/catalog/magazine')
                .expect(401);
        });
        it('successfully gets all magazine types', async () => {
            Catalog.viewItems = jest.fn().mockReturnValueOnce([magazine]);
            const response = await supertest(server)
                .get('/catalog/magazine')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(response.body.length).toEqual(1);
            expect(response.body[0].catalogItemType).toEqual('magazine');
        });
        it('handles invalid type', async () => {
            await supertest(server)
                .get('/catalog/invalid')
                .set('Authorization', `Bearer ${token}`)
                .expect(400);
        });
        it('handles bad request error', async () => {
            Catalog.viewItems = jest.fn(() => {
                throw new Error();
            });
            await supertest(server)
                .get('/catalog/magazine')
                .set('Authorization', `Bearer ${token}`)
                .expect(500);
        });
    });

    describe('GET /catalog/:type/:id', () => {
        const magazine: Magazine = new Magazine(
            'test',
            'Popular Mechanics',
            'Test Date',
            123,
            123,
            'Test Pub',
            'English',
        );

        it('requires user authentication', async () => {
            await supertest(server)
                .get('/catalog/magazine/test')
                .expect(401);
        });
        it('successfully gets the magazine with specified id', async () => {
            Catalog.viewItem = jest.fn().mockReturnValueOnce(magazine);
            const response = await supertest(server)
                .get('/catalog/magazine/test')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(response.body.catalogItem).toEqual(magazine);
        });
        it('handles invalid type', async () => {
            await supertest(server)
                .get('/catalog/invalid/test')
                .set('Authorization', `Bearer ${token}`)
                .expect(400);
        });
        it('handles non-existent catalog item with specified id', async () => {
            Catalog.viewItem = jest.fn().mockReturnValueOnce(null);
            await supertest(server)
                .get('/catalog/magazine/test')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });
        it('handles bad request error', async () => {
            Catalog.viewItem = jest.fn(() => {
                throw new Error();
            });
            await supertest(server)
                .get('/catalog/magazine/test')
                .set('Authorization', `Bearer ${token}`)
                .expect(500);
        });
    });

    describe('POST /catalog/:type/:id', () => {
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
        };

        it('requires admin rights', async () => {
            await supertest(server)
                .post('/catalog/magazine/test')
                .expect(403);
        });
        it('Creates a catalog item of the specified type', async () => {
            const updatedItem: Book = {
                id: '1',
                title: 'TestBook',
                date: 'TestDate',
                isbn10: 1234567890,
                isbn13: 123456789012,
                author: 'TestAuthor',
                publisher: 'TestPublisher',
                format: BookFormat.HardCover,
                pages: 69,
            };

            Catalog.updateItem = jest.fn().mockReturnValueOnce(updatedItem);

            const response = await supertest(server)
                .post('/catalog/book/1')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send(bookRequest)
                .expect(200);

            expect(response.body).toEqual(updatedItem);
        });
        it('handles invalid type', async (done) => {
            supertest(server)
                .post('/catalog/invalid/test')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send(bookRequest)
                .expect(400)
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
            };
            supertest(server)
                .post('/catalog/book/test')
                .set('Authorization', `Bearer ${token}`)
                .send(invalidRequest)
                .expect(400)
                .end((err: any, res: any) => {
                    if (err) return done(err);
                    done();
                });
        });
        it('handles bad request', async (done) => {
            Catalog.updateItem = jest.fn(() => {
                throw new Error();
            });

            supertest(server)
                .post('/catalog/book/test')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send(bookRequest)
                .expect(500)
                .end((err: any, res: any) => {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('PUT /catalog/:type/:catalogItemId/inventory', () => {
        const catalogItemId = 'test';

        it('requires admin rights', async () => {
            await supertest(server)
                .put(`/catalog/book/${catalogItemId}/inventory`)
                .expect(403);
        });

        it('throws an error if a non-existing catalogItem is requested', async (done) => {
            Catalog.addInventoryItem = jest.fn().mockReturnValueOnce(null);
            supertest(server)
                .put('/catalog/book/bad/inventory')
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(404)
                .end((err: any, res: any) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('handles bad request', async (done) => {
            Catalog.addInventoryItem = jest.fn(() => {
                throw new Error();
            });
            supertest(server)
                .put(`/catalog/book/${catalogItemId}/inventory`)
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(500)
                .end((err: any, res: any) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('successfully adds an inventory item', async () => {
            Catalog.addInventoryItem = jest.fn().mockReturnValueOnce(1);
            const response = await supertest(server)
            .put(`/catalog/book/${catalogItemId}/inventory`)
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(200);

            expect(response.body.id).toEqual(1);
        });
    });

    describe('DELETE /catalog/:type/:id', () => {
        it('requires admin rights', async () => {
            await supertest(server)
                .delete('/catalog/magazine/1')
                .expect(403);
        });

        it('handles invalid type', async (done) => {
            supertest(server)
                .delete('/catalog/invalid/1')
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(400)
                .end((err: any, res: any) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('throws an error if trying to delete a non-existing catalog item', async (done) => {
            Catalog.deleteItem = jest.fn().mockReturnValueOnce(false);
            supertest(server)
                .delete('/catalog/magazine/dne')
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(404)
                .end((err: any, res: any) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('successfully deletes a catalog item', async () => {
            Catalog.deleteItem = jest.fn().mockReturnValueOnce(true);
            await supertest(server)
                .delete('/catalog/magazine/1')
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(200);
        });
    });

    describe('DELETE /catalog/:type/:id/inventory', () => {
        it('requires admin rights', async () => {
            await supertest(server)
                .delete('/catalog/magazine/1/inventory')
                .expect(403);
        });

        it('throws an error if trying to delete from a non-existing catalog item', async (done) => {
            Catalog.deleteInventoryItem = jest.fn().mockReturnValueOnce(false);
            supertest(server)
                .delete('/catalog/magazine/dne/inventory')
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(404)
                .end((err: any, res: any) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('deletes an available inventory item for a specific catalog item', async () => {
            Catalog.deleteInventoryItem = jest.fn().mockReturnValueOnce(true);
            await supertest(server)
                .delete('/catalog/magazine/1/inventory')
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(200);
        });

        it('will not delete an unavailable inventory item', async (done) => {
            Catalog.deleteInventoryItem = jest.fn().mockReturnValueOnce(false);
            supertest(server)
                .delete('/catalog/magazine/1/inventory')
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(404)
                .end((err: any, res: any) => {
                    if (err) return done(err);
                    done();
                });
        });

    });
});
