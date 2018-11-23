import { CatalogItem } from './CatalogItem';

class Magazine extends CatalogItem {
    public asin: string;
    public publisher: string;
    public language: string;
    public timestamp: Date;

    constructor (
        id: string,
        title: string,
        date: string,
        asin: string,
        publisher: string,
        language: string,
        timestamp?: Date) {
        super(id, title, date);
        this.asin = asin;
        this.publisher = publisher;
        this.language = language;
        this.timestamp = timestamp;
    }
}
export { Magazine };
