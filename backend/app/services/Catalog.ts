import { CatalogItem, InventoryItem, Book, Magazine, Movie, Music } from '../models';
import {
    BookTDG,
    InventoryTDG,
    MagazineTDG,
    MovieTDG,
    MusicTDG,
    CatalogTDG,
 } from '../persistence';

export enum CatalogItemType {
    MUSIC = 'MUSIC',
    MOVIE = 'MOVIE',
    BOOK = 'BOOK',
    MAGAZINE = 'MAGAZINE',
}

class Catalog {
    viewItems = async () : Promise<CatalogItem[]> => {
        return [
            ...(await BookTDG.findAll()),
            ...(await MagazineTDG.findAll()),
            ...(await MovieTDG.findAll()),
            ...(await MusicTDG.findAll()),
        ];
    }

    updateItem = async (item: CatalogItem, type: CatalogItemType) : Promise<CatalogItem> => {
        switch (type) {
        case CatalogItemType.BOOK:
            await BookTDG.update(item as Book);
            break;
        case CatalogItemType.MUSIC:
            await MusicTDG.update(item as Music);
            break;
        case CatalogItemType.MAGAZINE:
            await MagazineTDG.update(item as Magazine);
            break;
        case CatalogItemType.MOVIE:
            await MovieTDG.update(item as Movie);
            break;
        }
        return item;
    }

    addItem = async (item: CatalogItem, type: CatalogItemType, quantity: number)
        : Promise<{ catalogItem: CatalogItem, inventory: InventoryItem[] }> => {
        let insertedItem: CatalogItem;
        switch (type) {
        case CatalogItemType.BOOK:
            insertedItem = await BookTDG.insert(item as Book);
            break;
        case CatalogItemType.MUSIC:
            insertedItem = await MusicTDG.insert(item as Music);
            break;
        case CatalogItemType.MAGAZINE:
            insertedItem = await MagazineTDG.insert(item as Magazine);
            break;
        case CatalogItemType.MOVIE:
            insertedItem = await MovieTDG.insert(item as Movie);
            break;
        }
        const inventoryItems = [];
        for (let i = 0; i < quantity; i += 1) {
            const inventoryItem: InventoryItem = new InventoryItem(null, insertedItem.id, true);
            inventoryItems.push(await InventoryTDG.insert(inventoryItem));
        }

        return {
            catalogItem: insertedItem,
            inventory: inventoryItems,
        };
    }

    addInventoryItem = async (catalogItemId: string) : Promise<string> => {
        const spec = await CatalogTDG.find(catalogItemId);
        if (!spec) {
            throw new Error('Catalog item does not exist');
        }

        let inventoryItem: InventoryItem = new InventoryItem(null, catalogItemId, true);
        inventoryItem = await InventoryTDG.insert(inventoryItem);

        return inventoryItem.id;
    }

    deleteItem = async (id: string, type: CatalogItemType): Promise<boolean> => {
        await InventoryTDG.deleteAll(id);
        switch (type.toUpperCase()) {
        case CatalogItemType.BOOK:
            await BookTDG.delete(id);
            break;
        case CatalogItemType.MOVIE:
            await MovieTDG.delete(id);
            break;
        case CatalogItemType.MUSIC:
            await MusicTDG.delete(id);
            break;
        case CatalogItemType.MAGAZINE:
            await MagazineTDG.delete(id);
            break;
        }
        return true;
    }

    deleteInventoryItem = async (catalogItemId: string) : Promise<boolean> => {
        try {
            const items = await InventoryTDG.findAll(catalogItemId);
            let item: InventoryItem;
            for (let i = 0; i < items.length; i += 1) {
                if (items[i].available) {
                    item = items[i];
                    break;
                }
            }

            if (!item) {
                return false;
            }

            await InventoryTDG.delete(item.id);
        } catch (err) {
            console.log(err);
            return false;
        }
        return true;
    }
}

export default new Catalog();
