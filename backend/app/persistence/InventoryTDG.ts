import { TableDataGateway } from './TableDataGateway';
import { InventoryItem } from '../models';

class InventoryTDG implements TableDataGateway {
    find(id: string): Promise<InventoryItem> {
        throw new Error('Method not implemented.');
    }
    findAll(): Promise<InventoryItem[]> {
        throw new Error('Method not implemented.');
    }
    insert(item: InventoryItem): Promise<InventoryItem> {
        throw new Error('Method not implemented.');
    }
    update(item: InventoryItem): Promise<void> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

export default new InventoryTDG();
