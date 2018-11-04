import { CatalogItem } from './CatalogItem';

enum MusicType {
    CD = 'CD',
    VINYL = 'VINYL',
    DIGITIAL = 'DIGITAL',
}

class Music extends CatalogItem {
    public catalogItemType = 'music';
    public type: MusicType;
    public artist: string;
    public label: string;
    public asin: string;

    constructor (
        id: string,
        title: string,
        date: string,
        type: MusicType,
        artist: string,
        label: string,
        asin: string) {
        super(id, title, date);
        this.type = type;
        this.artist = artist;
        this.label = label;
        this.asin = asin;
    }
}
export { Music, MusicType };
