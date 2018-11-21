import { Client } from './Client';
import { InventoryItem } from './InventoryItem';

export enum OperationType {
    LOAN = 'LOAN',
    RETURN = 'RETURN',
}

class Transaction {
    public id: string;
    public timestamp: Date;
    public operation: OperationType;
    public user: Client;
    public inventoryItem: InventoryItem;

    constructor(
        id: string,
        timestamp: Date,
        operation: OperationType,
        user: Client,
        inventoryItem: InventoryItem,
    ) {
        this.id = id;
        this.timestamp = timestamp;
        this.operation = operation;
        this.user = user;
        this.inventoryItem = inventoryItem;
    }
}

export { Transaction };
