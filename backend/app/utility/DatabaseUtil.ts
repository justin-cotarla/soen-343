import * as mysql from 'mysql';

export declare interface QueryResponse {
    rows: any;
    fields?: mysql.FieldInfo[];
}

class DatabaseUtil {
    pool: mysql.Pool;

    constructor() {
        this.init();
    }

    init() {
        this.pool = mysql.createPool({
            connectionLimit: 10,
            host: 'database',
            user: 'user',
            password: process.env.DB_KEY,
            database: 'library_db',
        });
    }

    getConnection(): Promise<mysql.Connection> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(connection);
            });
        });
    }

    async sendQuery(queryString: string, values?: any[]): Promise<QueryResponse> {
        const query = mysql.format(queryString, values);

        const connection = await this.getConnection();

        return new Promise<QueryResponse>((resolve, reject) => {
            connection.query(values !== undefined ? query : queryString, (err, rows, fields) => {
                connection.end();
                if (err) {
                    console.log(`Query: ${values !== undefined ? query : queryString}`);
                    reject(err);
                    return;
                }
                resolve({
                    rows,
                    fields,
                });
            });
        });
    }

    end() {
        this.pool.end();
    }
}

export default new DatabaseUtil();
