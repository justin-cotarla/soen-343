export interface TableDataGateway  {
    find(id: string): Promise<any>;
    insert(item: any): Promise<boolean>;
    update(item: any): Promise<boolean>;
    delete(id: string): Promise<any>;
}
