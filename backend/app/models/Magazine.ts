import { CatalogItem } from './CatalogItem';

class Magazine extends CatalogItem {
    public isbn10: number;
    public isbn13: number;
    public publisher: string;
    public language: string;

    constructor (
        id: number,
        title: string,
        date: string,
        isbn10: number,
        isbn13: number,
        publisher: string,
        language: string) {
        super(id, title, date);
        this.isbn10 = isbn10;
        this.isbn13 = isbn13;
        this.publisher = publisher;
        this.language = language;
    }
}
export { Magazine };
