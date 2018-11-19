export enum OperationType {
    LOAN = 'LOAN',
    RETURN = 'RETURN',
}

class Transaction {
    public id: string;
    public timestamp: Date;
    public operation: OperationType;
    public userId: string;
    public inventoryItemId: string;

    constructor(
        id: string,
        timestamp: Date,
        operation: OperationType,
        userId: string,
        inventoryItemId: string,
    ) {
        this.id = id;
        this.timestamp = timestamp;
        this.operation = operation;
        this.userId = userId;
        this.inventoryItemId = inventoryItemId;
    }
}

export { Transaction };
