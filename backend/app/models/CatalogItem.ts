class CatalogItem {
    public id: string;
    public title: string;
    public date: string;

    constructor (
        id: string,
        title: string,
        date: string) {
        this.id = id;
        this.title = title;
        this.date = date;
    }

}
export { CatalogItem };
