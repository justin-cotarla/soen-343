export interface TableDataGateway  {
    find(id:string):any;
    insert(item:any):boolean;
    update(item:any):boolean;
    delete(id:string):any;
}
