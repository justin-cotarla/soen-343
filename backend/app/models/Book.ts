import { CatalogItem } from './CatalogItem';

export enum BookFormat {
    HardCover = 'HardCover',
    PaperBack = 'PaperBack',
}

class Book extends CatalogItem {
    public isbn10: number;
    public isbn13: number;
    public author: string;
    public publisher: string;
    public format: BookFormat;
    public pages: number;
    public timestamp: string;

    constructor (
        id: string,
        title: string,
        date: string,
        isbn10: number,
        isbn13: number,
        author: string,
        publisher: string,
        format: BookFormat,
        pages: number,
        timestamp?: string) {
        super(id, title, date);
        this.isbn10 = isbn10;
        this.isbn13 = isbn13;
        this.author = author;
        this.publisher = publisher;
        this.format = format;
        this.pages = pages;
        this.timestamp = timestamp;
    }
}

export { Book };
