import { TableDataGateway } from './TableDataGateway';
import { Book } from '../models';
import DatabaseUtil from '../utility/DatabaseUtil';

class BookTDG implements TableDataGateway {

    find = async(id: string) : Promise<Book> => {

        try {
            const query = `
                SELECT
                *
                FROM CATALOG_ITEM
                INNER JOIN BOOK ON CATALOG_ITEM.ID = BOOK.CATALOG_ITEM_ID
                WHERE ID = ?
            `;

            const data = await DatabaseUtil.sendQuery(query, [id]);
            if (!data.rows.length) {
                return null;
            }

            const books = data.rows.map(book =>
                new Book(
                    book.ID,
                    book.TITLE,
                    book.DATA,
                    book.ISBN_10,
                    book.ISBN_13,
                    book.AUTHOR,
                    book.PUBLISHER,
                    book.FORMAT,
                    book.PAGES,
                ));

            return books[0];
        } catch (err) {
            console.log(`error: ${err}`);
            return null;
        }
    }

    insert = async (item: Book): Promise<boolean> => {
        if (item === null) {
            throw new Error('Cannot add null book item');
        }

        try {

            const queryCatalogItem = `
                INSERT INTO CATALOG_ITEM
                (TITLE, DATE)
                VALUES
                (?, ?)
            `;

            const queryBook  = `
                INSERT INTO BOOK
                (ISBN_10, ISBN_13, AUTHOR, PUBLISHER, FORMAT, PAGES, CATALOG_ITEM_ID)
                VALUES
                (?, ?, ?, ?, ?, ?)
            `;

            await DatabaseUtil.sendQuery(queryCatalogItem, [
                item.title,
                item.date,
            ]);

            await DatabaseUtil.sendQuery(queryBook, [
                item.isbn10.toString(),
                item.isbn13.toString(),
                item.author,
                item.publisher,
                item.format.toString(),
                item.pages.toString(),
                item.id.toString(),
            ]);
            return true;
        } catch (err) {
            console.log(`error: ${err}`);
            return false;
        }
    }

    update = async (item: Book): Promise<boolean> => {
        try {
            const queryCatalogItem = `
                UPDATE
                CATALOG_ITEM
                SET TITLE = ?,
                DATE = ?
                WHERE ID = ?
            `;

            const queryBook = `
                UPDATE
                BOOK
                SET TITLE = ?,
                DATE = ?,
                ISBN_10 = ?,
                ISBN_13 = ?,
                AUTHOR = ?,
                PUBLISHER = ?,
                FORMAT = ?,
                PAGES = ?,
                WHERE CATALOG_ITEM_ID = ?
            `;

            await DatabaseUtil.sendQuery(queryCatalogItem, [
                item.title,
                item.date,
                item.id,
            ]);

            await DatabaseUtil.sendQuery(queryBook, [
                item.isbn10.toString(),
                item.isbn13.toString(),
                item.author,
                item.publisher,
                item.format.toString(),
                item.pages.toString(),
                item.id,
            ]);
            return true;
        } catch (err) {
            console.log(`error: ${err}`);
            return false;
        }
    }

    delete = async (id: string): Promise<Book> => {
        const foundBook = await this.find(id);
        if (foundBook) {
            try {
                const queryCatalogItem = `
                    DELETE
                    FROM CATALOG_ITEM
                    WHERE ID = ?
                `;
                const queryBook = `
                    DELETE
                    FROM BOOK
                    WHERE CATALOG_ITEM_ID = ?
                `;

                await DatabaseUtil.sendQuery(queryCatalogItem, [id]);
                await DatabaseUtil.sendQuery(queryBook, [id]);
                return foundBook;
            } catch (err) {
                console.log(`error: ${err}`);
                return null;
            }
        }
        return null;
    }
}
