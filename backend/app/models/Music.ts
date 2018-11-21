import { CatalogItem } from './CatalogItem';

export enum MusicType {
    CD = 'CD',
    VINYL = 'VINYL',
    DIGITIAL = 'DIGITAL',
}

class Music extends CatalogItem {
    public type: MusicType;
    public artist: string;
    public label: string;
    public asin: string;
    public timestamp: Date;

    constructor (
        id: string,
        title: string,
        date: string,
        type: MusicType,
        artist: string,
        label: string,
        asin: string,
        timestamp?: Date) {
        super(id, title, date);
        this.type = type;
        this.artist = artist;
        this.label = label;
        this.asin = asin;
        this.timestamp = timestamp;
    }
}
export { Music };
