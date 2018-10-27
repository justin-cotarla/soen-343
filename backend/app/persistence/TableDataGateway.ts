export interface TableDataGateway  {
    find(...args: any[]): Promise<any>;
    findAll(...args: any[]): Promise<any>;
    insert(item: any): Promise<any>;
    update(item: any): Promise<void>;
    delete(id: string): Promise<void>;
}
