import { TableDataGateway } from './TableDataGateway';
import { Music } from '../models';
import DatabaseUtil from '../utility/DatabaseUtil';


class MusicTDG implements TableDataGateway {

    find = async(id: string): Promise<Music> => {
            return null;      
    }
    insert = async(item: Music): Promise<boolean> => {
            return false;   
    }
    update = async (item: Music): Promise<boolean> => {
            return false;       
    }
    delete = async (id:string): Promise<Music> => {
        return null;
    }
}
