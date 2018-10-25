import { TableDataGateway } from './TableDataGateway';
import { Book } from '../models';
import DatabaseUtil from '../utility/DatabaseUtil';

class BookTDG implements TableDataGateway {

    find = async(id: string) : Promise<Book> => {

        try {
            const query = `
                SELECT
                *
                FROM BOOK
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
                    book.ISBN10,
                    book.ISBN13,
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
            const query  = `
            INSERT INTO BOOK
            (TITLE, DATE, ISBN10, ISBN13, AUTHOR, PUBLISHER, FORMAT, PAGES)
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await DatabaseUtil.sendQuery(query, [
                item.id,
                item.title,
                item.date,
                item.isbn10.toString(),
                item.isbn13.toString(),
                item.author,
                item.publisher,
                item.format.toString(),
                item.pages.toString(),
            ]);
            return true;
        } catch (err) {
            console.log(`error: ${err}`);
            return false;
        }
    }

    update = async (item: Book): Promise<boolean> => {
        try {
            const query = `
                UPDATE
                BOOK
                WHERE ID = ?
                SET TITLE = ?,
                DATE = ?,
                ISBN10 = ?,
                ISBN13 = ?,
                AUTHOR = ?,
                PUBLISHER = ?,
                FORMAT = ?,
                PAGES = ?,
            `;

            await DatabaseUtil.sendQuery(query, [
                item.id,
                item.title,
                item.date,
                item.isbn10.toString(),
                item.isbn13.toString(),
                item.author,
                item.publisher,
                item.format.toString(),
                item.pages.toString(),
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
                const query = `
                DELETE
                FROM BOOK
                WHERE ID = ?
                `;

                await DatabaseUtil.sendQuery(query, [id]);
                return foundBook;
            } catch (err) {
                console.log(`error: ${err}`);
                return null;
            }
        }
        return null;
    }
}
