import 'jest';
import Catalog, { CatalogItemType } from '../services/Catalog';
import { CatalogItem, InventoryItem, Book, Magazine, Movie, Music } from '../models';
import {
    BookTDG,
    InventoryTDG,
    MagazineTDG,
    MovieTDG,
    MusicTDG,
    CatalogTDG,
 } from '../persistence';
import { BookFormat } from '../models/Book';

const mockBook = new Book(
    '18943043',
    'Matilda',
    '1980',
    1234546890,
    1234567890123,
    'Roald Dahl',
    'Penguin',
    BookFormat.PaperBack,
    300,
);
const mockInventory = new InventoryItem(
    '10000',
    '12435',
    true,
);

beforeEach(async () => {
    jest.clearAllMocks();
});

describe('Catalog', () => {
    describe('viewItems', () => {
        BookTDG.findAll = jest.fn().mockReturnValueOnce([mockBook]);
        MagazineTDG.findAll = jest.fn().mockReturnValueOnce([]);
        MovieTDG.findAll = jest.fn().mockReturnValueOnce([]);
        MusicTDG.findAll = jest.fn().mockReturnValueOnce([]);

        it('successfully views items', async () => {
            const result = await Catalog.viewItems();
            expect(result).toEqual([mockBook]);
            expect(result.length).toEqual(1);
        });
        // it('returns wrong item', async () => {
        //     const result = await Catalog.viewItems();
        //     expect(result).not.toEqual([mockBook]);
        //     expect(result.length).toEqual(1);
        // });
    });
    describe('viewItem', () => {
        it('successfully views item', async () => {
            BookTDG.find = jest.fn().mockReturnValueOnce(mockBook);
            const result = await Catalog.viewItem('18943043', CatalogItemType.BOOK);
            expect(result).toEqual(mockBook);
        });
        it('unable to find item', async () => {
            BookTDG.find = jest.fn().mockReturnValueOnce(null);
            const result = await Catalog.viewItem('18943043', CatalogItemType.BOOK);
            expect(result).toBe(null);
        });
    });
    describe('viewInventorytems', () => {
        it('successfully views inventory item', async () => {
            InventoryTDG.findAll = jest.fn().mockReturnValueOnce([mockInventory]);
            const result = await Catalog.viewInventoryItems(mockInventory.catalogItemId);
            expect(result).toEqual([mockInventory]);
            expect(result.length).toEqual(1);
        });
        it('catalog item id does not exist', async () => {
            InventoryTDG.findAll = jest.fn().mockReturnValueOnce([]);
            const result = await Catalog.viewInventoryItems('');
            expect(result).toEqual([]);
        });
    });
    describe('updateItem', () => {
        it('successfully updates item', async () => {
            BookTDG.update = jest.fn();
            await Catalog.updateItem(mockBook, CatalogItemType.BOOK);
            expect(BookTDG.update).toHaveBeenCalled();
            expect(BookTDG.update).toHaveBeenCalledWith(mockBook);
        });
        it('if item is undefined', async () => {
            BookTDG.update = jest.fn(() => {
                throw new Error('Undefined item');
            });
            try {
                await Catalog.updateItem(null, CatalogItemType.BOOK);
            } catch (err) {
                expect(err).toEqual(new Error('Undefined item'));
            }
        });
    });
    describe('addItem', () => {
        it('successfully adds item', async () => {
            BookTDG.insert = jest.fn().mockReturnValueOnce(mockBook);
            InventoryTDG.insert = jest.fn()
            .mockReturnValueOnce(new InventoryItem(null, mockBook.id, true));
            const result = await Catalog.addItem(mockBook, CatalogItemType.BOOK, 1);
            expect(result).toEqual({
                catalogItem: mockBook,
                inventory: [new InventoryItem(null, mockBook.id, true)],
            });
        });
        it('if item is null', async () => {
            BookTDG.insert = jest.fn(() => {
                throw new Error('Undefined item');
            });
            try {
                const result = await Catalog.addItem(null, CatalogItemType.BOOK, 1);
            } catch (err) {
                expect(err).toEqual(new Error('Undefined item'));
            }
        });
    });
    describe('addInventoryItem', () => {
        it('successfully adds inventory item', async () => {
            CatalogTDG.find = jest.fn().mockReturnValueOnce(mockInventory);
            InventoryTDG.insert = jest.fn().mockReturnValueOnce(mockInventory);
            const result = await Catalog.addInventoryItem(mockInventory.catalogItemId);
            expect(result).toEqual(mockInventory.id);
        });
        it('if item is undefined', async () => {
            try {
                const result = await Catalog.addInventoryItem('');
            } catch (err) {
                expect(err).toEqual(new Error('Catalog item does not exist'));
            }
        });
    });
    describe('deleteItem', () => {
        it('successfully deletes item', async () => {
            BookTDG.delete = jest.fn().mockReturnValueOnce(mockBook);
            await Catalog.deleteItem(mockBook.id, CatalogItemType.BOOK);
            expect(BookTDG.delete).toBeCalled();
            expect(BookTDG.delete).toBeCalledWith(mockBook.id);
        });
        it('encounters empty string or no corresponding item', async () => {
            BookTDG.delete = jest.fn(() => {
                throw new Error('No book found.');
            });
            try {
                await Catalog.deleteItem('', CatalogItemType.BOOK);
            } catch (err) {
                expect(err).toEqual(new Error('No book found.'));
            }
        });
    });
    describe('deleteInventoryItem', () => {
        it('successfully deletes inventory item', async () => {
            InventoryTDG.findAll = jest.fn().mockReturnValueOnce([mockInventory]);
            InventoryTDG.delete = jest.fn();
            const result = await Catalog.deleteInventoryItem(mockInventory.catalogItemId);
            expect(result).toBe(true);
        });
        it('encounters empty string or no corresponding inventory item', async () => {
            InventoryTDG.findAll = jest.fn().mockReturnValueOnce([]);
            const result = await Catalog.deleteInventoryItem('');
            expect(result).toBe(false);
        });
    });
});
