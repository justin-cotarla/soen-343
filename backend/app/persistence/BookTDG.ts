import { CatalogTDG } from './CatalogTDG';
import { Book } from '../models';
import DatabaseUtil from '../utility/DatabaseUtil';

class BookTDG extends CatalogTDG{
    async find(id: string) : Promise<Book> {
        try {
            const query = `
                SELECT
                *
                FROM CATALOG_ITEM
                JOIN BOOK
                ON CATALOG_ITEM.ID = BOOK.CATALOG_ITEM_ID
                WHERE ID = ?
            `;

            const data = await DatabaseUtil.sendQuery(query, [id]);
            if (!data.rows.length) {
                return null;
            }

            const book = data.rows[0];
            return new Book(
                book.ID,
                book.TITLE,
                book.DATE,
                book.ISBN_10,
                book.ISBN_13,
                book.AUTHOR,
                book.PUBLISHER,
                book.FORMAT,
                book.PAGES,
            );
        } catch (err) {
            console.log(err);
        }
    }

    async findAll(): Promise<Book[]> {
        try {
            const query = `
            SELECT
            *
            FROM
            CATALOG_ITEM
            JOIN BOOK
            ON ID = CATALOG_ITEM_ID
            `;
            const data = await DatabaseUtil.sendQuery(query);
            if (!data.rows.length) {
                return [];
            }

            return data.rows.map((book: any) => new Book(
                    book.ID,
                    book.TITLE,
                    book.DATE,
                    book.ISBN_10,
                    book.ISBN_13,
                    book.AUTHOR,
                    book.PUBLISHER,
                    book.FORMAT,
                    book.PAGES,
                ));
        } catch (err) {
            console.log(err);
        }
    }

    async insert(item: Book): Promise<Book> {
        try {
            const queryBook  = `
            INSERT
            INTO
            BOOK
            (
                ISBN_10,
                ISBN_13,
                AUTHOR,
                PUBLISHER,
                FORMAT,
                PAGES,
                CATALOG_ITEM_ID
            )
            VALUES
            (?, ?, ?, ?, ?, ?, ?)
            `;

            const catalogItem = await super.insert(item);

            await DatabaseUtil.sendQuery(queryBook, [
                item.isbn10.toString(),
                item.isbn13.toString(),
                item.author,
                item.publisher,
                item.format.toString(),
                item.pages.toString(),
                catalogItem.id,
            ]);

            return new Book(
                catalogItem.id,
                catalogItem.title,
                catalogItem.date,
                item.isbn10,
                item.isbn13,
                item.author,
                item.publisher,
                item.format,
                item.pages,
            );
        } catch (err) {
            console.log(err);
        }
    }

    async update(item: Book): Promise<void> {
        try {
            const query = `
                UPDATE
                CATALOG_ITEM
                JOIN BOOK ON ID = CATALOG_ITEM_ID
                SET
                TITLE = ?,
                DATE = ?,
                ISBN_10 = ?,
                ISBN_13 = ?,
                AUTHOR = ?,
                PUBLISHER = ?,
                FORMAT = ?,
                PAGES = ?
                WHERE ID = ?
            `;

            await DatabaseUtil.sendQuery(query, [
                item.title,
                item.date,
                item.isbn10.toString(),
                item.isbn13.toString(),
                item.author,
                item.publisher,
                item.format.toString(),
                item.pages.toString(),
                item.id,
            ]);
        } catch (err) {
            console.log(err);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const query = `
                DELETE
                FROM BOOK
                WHERE CATALOG_ITEM_ID = ?
            `;

            await DatabaseUtil.sendQuery(query, [id]);
            await super.delete(id);
        } catch (err) {
            console.log(err);
        }
    }
}

export default new BookTDG();
