import { CatalogItem } from './CatalogItem';

class Magazine extends CatalogItem {
    public isbn10: number;
    public isbn13: number;
    public publisher: string;
    public language: string;
    public timestamp: string;

    constructor (
        id: string,
        title: string,
        date: string,
        isbn10: number,
        isbn13: number,
        publisher: string,
        language: string,
        timestamp?: string) {
        super(id, title, date);
        this.isbn10 = isbn10;
        this.isbn13 = isbn13;
        this.publisher = publisher;
        this.language = language;
        this.timestamp = timestamp;
    }
}
export { Magazine };
