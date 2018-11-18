export enum OperationType {
    LOAN = 'LOAN',
    RETURN = 'RETURN',
}

class Transaction {
    public id: string;
    public timestamp: string;
    public operation: OperationType;
    public borrower: string;
    public inventoryItem: string;

    constructor(
        id: string,
        timestamp: string,
        operation: OperationType,
        borrower: string,
        inventoryItem: string,
    ) {
        this.id = id;
        this.timestamp = timestamp;
        this.operation = operation;
        this.borrower = borrower;
        this.inventoryItem = inventoryItem;
    }
}

export { Transaction };
