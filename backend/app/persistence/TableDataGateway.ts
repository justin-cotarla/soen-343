export interface TableDataGateway  {
    find(id: string): Promise<any>;
    findAll(): Promise<any>;
    insert(item: any): Promise<any>;
    update(item: any): Promise<void>;
    delete(id: string): Promise<void>;
}
