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
import { MusicType } from '../models/Music';

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
const mockMagazine = new Magazine(
    '092849302',
    'lstw',
    '2018',
    1234567891,
    1234567891011,
    'Random House',
    'En',
);
const mockMusic = new Music(
    '43243',
    'The Bird',
    '2016',
    MusicType.VINYL,
    'Anderson .Paak',
    'Top Dog',
    '1232154121',
);
const mockMovie = new Movie(
    '2344354354',
    'Eternal Sunshine of the Spotless Mind',
    '2003',
    'Michel Gondry',
    'Emily Rockwell',
    'Jim Carrey',
    'en',
    'none',
    'false',
    183,
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
        BookTDG.findAll = jest.fn().mockReturnValue([mockBook]);
        MagazineTDG.findAll = jest.fn().mockReturnValue([mockMagazine]);
        MovieTDG.findAll = jest.fn().mockReturnValue([mockMovie]);
        MusicTDG.findAll = jest.fn().mockReturnValue([mockMusic]);

        it('successfully views book', async () => {
            const result = await Catalog.viewItems(
                mockBook.title,
                'date',
                'desc',
                CatalogItemType.BOOK,
            );
            expect(result).toEqual([mockBook]);
            expect(result.length).toEqual(1);
        });

        it('successfully views magazine', async () => {
            const result = await Catalog.viewItems(
                mockMagazine.title,
                'date',
                'assc',
                CatalogItemType.MAGAZINE,
            );
            expect(result).toEqual([mockMagazine]);
            expect(result.length).toEqual(1);
        });

        it('successfullly views movie', async () => {
            const result = await Catalog.viewItems(
                mockMovie.title,
                'title',
                'desc',
                CatalogItemType.MOVIE,
                );
            expect(result).toEqual([mockMovie]);
            expect(result.length).toEqual(1);
        });

        it('successfully views music', async () => {
            const result = await Catalog.viewItems(
                mockMusic.title,
                'title',
                'asc',
                CatalogItemType.MUSIC,
            );
            expect(result).toEqual([mockMusic]);
            expect(result.length).toEqual(1);
        });

        it('successfully views default book', async () => {
            const result = await Catalog.viewItems(
                mockBook.title,
                'date',
                'desc',
            );
            expect(result).toContain(mockBook);
            expect(result).toContain(mockMagazine);
            expect(result).toContain(mockMovie);
            expect(result).toContain(mockMusic);
            expect(result.length).toEqual(4);
        });
    });
    describe('viewItem', () => {
        it('successfully views book', async () => {
            BookTDG.find = jest.fn().mockReturnValueOnce(mockBook);
            const result = await Catalog.viewItem('18943043', CatalogItemType.BOOK);
            expect(result).toEqual(mockBook);
        });
        it('successfully views magazine', async () => {
            MagazineTDG.find = jest.fn().mockReturnValueOnce(mockMagazine);
            const result = await Catalog.viewItem('18943043', CatalogItemType.MAGAZINE);
            expect(result).toEqual(mockMagazine);
        });
        it('successfully views movie', async () => {
            MovieTDG.find = jest.fn().mockReturnValueOnce(mockMovie);
            const result = await Catalog.viewItem('18943043', CatalogItemType.MOVIE);
            expect(result).toEqual(mockMovie);
        });
        it('successfully views music', async () => {
            MusicTDG.find = jest.fn().mockReturnValueOnce(mockMusic);
            const result = await Catalog.viewItem('18943043', CatalogItemType.MUSIC);
            expect(result).toEqual(mockMusic);
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
        it('successfully updates book', async () => {
            BookTDG.update = jest.fn();
            await Catalog.updateItem(mockBook, CatalogItemType.BOOK);
            expect(BookTDG.update).toHaveBeenCalled();
            expect(BookTDG.update).toHaveBeenCalledWith(mockBook);
        });
        it('successfully updates magazine', async () => {
            MagazineTDG.update = jest.fn();
            await Catalog.updateItem(mockMagazine, CatalogItemType.MAGAZINE);
            expect(MagazineTDG.update).toHaveBeenCalled();
            expect(MagazineTDG.update).toHaveBeenCalledWith(mockMagazine);
        });
        it('successfully updates movie', async () => {
            MovieTDG.update = jest.fn();
            await Catalog.updateItem(mockMovie, CatalogItemType.MOVIE);
            expect(MovieTDG.update).toHaveBeenCalled();
            expect(MovieTDG.update).toHaveBeenCalledWith(mockMovie);
        });
        it('successfully updates music', async () => {
            MusicTDG.update = jest.fn();
            await Catalog.updateItem(mockMusic, CatalogItemType.MUSIC);
            expect(MusicTDG.update).toHaveBeenCalled();
            expect(MusicTDG.update).toHaveBeenCalledWith(mockMusic);
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
        it('successfully adds book', async () => {
            BookTDG.insert = jest.fn().mockReturnValueOnce(mockBook);
            InventoryTDG.insert = jest.fn()
            .mockReturnValueOnce(new InventoryItem(null, mockBook.id, true));
            const result = await Catalog.addItem(mockBook, CatalogItemType.BOOK, 1);
            expect(result).toEqual({
                catalogItem: mockBook,
                inventory: [new InventoryItem(null, mockBook.id, true)],
            });
        });
        it('successfully adds magazine', async () => {
            MagazineTDG.insert = jest.fn().mockReturnValueOnce(mockMagazine);
            InventoryTDG.insert = jest.fn()
            .mockReturnValueOnce(new InventoryItem(null, mockMagazine.id, true));
            const result = await Catalog.addItem(mockMagazine, CatalogItemType.MAGAZINE, 1);
            expect(result).toEqual({
                catalogItem: mockMagazine,
                inventory: [new InventoryItem(null, mockMagazine.id, true)],
            });
        });
        it('successfully adds movie', async () => {
            MovieTDG.insert = jest.fn().mockReturnValueOnce(mockMovie);
            InventoryTDG.insert = jest.fn()
            .mockReturnValueOnce(new InventoryItem(null, mockMovie.id, true));
            const result = await Catalog.addItem(mockMovie, CatalogItemType.MOVIE, 1);
            expect(result).toEqual({
                catalogItem: mockMovie,
                inventory: [new InventoryItem(null, mockMovie.id, true)],
            });
        });
        it('successfully adds music', async () => {
            MusicTDG.insert = jest.fn().mockReturnValueOnce(mockMusic);
            InventoryTDG.insert = jest.fn()
            .mockReturnValueOnce(new InventoryItem(null, mockMusic.id, true));
            const result = await Catalog.addItem(mockMusic, CatalogItemType.MUSIC, 1);
            expect(result).toEqual({
                catalogItem: mockMusic,
                inventory: [new InventoryItem(null, mockMusic.id, true)],
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
        InventoryTDG.deleteAll = jest.fn().mockReturnValue(mockInventory);
        it('successfully deletes book', async () => {
            BookTDG.delete = jest.fn().mockReturnValueOnce(mockBook);
            await Catalog.deleteItem(mockBook.id, CatalogItemType.BOOK);
            expect(BookTDG.delete).toBeCalled();
            expect(BookTDG.delete).toBeCalledWith(mockBook.id);
        });
        it('successfully deletes magazine', async () => {
            MagazineTDG.delete = jest.fn().mockReturnValueOnce(mockMagazine);
            await Catalog.deleteItem(mockMagazine.id, CatalogItemType.MAGAZINE);
            expect(MagazineTDG.delete).toBeCalled();
            expect(MagazineTDG.delete).toBeCalledWith(mockMagazine.id);
        });
        it('successfully deletes movie', async () => {
            MovieTDG.delete = jest.fn().mockReturnValueOnce(mockMovie);
            await Catalog.deleteItem(mockMovie.id, CatalogItemType.MOVIE);
            expect(MovieTDG.delete).toBeCalled();
            expect(MovieTDG.delete).toBeCalledWith(mockMovie.id);
        });
        it('successfully deletes music', async () => {
            MusicTDG.delete = jest.fn().mockReturnValueOnce(mockMusic);
            await Catalog.deleteItem(mockMusic.id, CatalogItemType.MUSIC);
            expect(MusicTDG.delete).toBeCalled();
            expect(MusicTDG.delete).toBeCalledWith(mockMusic.id);
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
        it('successfully deletes inventory item', async () => {
            InventoryTDG.findAll = jest.fn().mockReturnValueOnce([mockInventory]);
            InventoryTDG.delete = jest.fn(() => {
                throw new Error('Inventory not deleted');
            });
            const result = await Catalog.deleteInventoryItem(mockInventory.catalogItemId);
            expect(result).toBe(false);
        });
    });
});
