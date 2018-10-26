import 'jest';
import mysql from 'mysql';

import DatabaseUtil from '../utility/DatabaseUtil';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('DatabaseUtil', () => {
    it('gets a connection', async () => {
        DatabaseUtil.pool.getConnection = jest.fn(callback => callback(undefined, 'connection'));

        const connection = await DatabaseUtil.getConnection();

        expect(connection).toMatch('connection');
    });

    it('handles connection errors', async () => {
        DatabaseUtil.pool.getConnection = jest.fn(callback => callback(new Error('error')));

        try {
            await DatabaseUtil.getConnection();
        } catch (err) {
            expect(err).toEqual(new Error('error'));
        }
    });

    it('handles valid queries', async () => {
        mysql.format = jest.fn();
        DatabaseUtil.getConnection = jest.fn(() => Promise.resolve({
            query: jest.fn((query, callback) => {
                callback(undefined, 'some rows', 'some fields');
            }),
            end: jest.fn(),
        }));

        const result = await DatabaseUtil.sendQuery('query');
        expect(result).toEqual({
            rows: 'some rows',
            fields: 'some fields',
        });
    });

    it('handles database errors', async () => {
        mysql.format = jest.fn();
        DatabaseUtil.getConnection = jest.fn(() => Promise.resolve({
            query: jest.fn((query, callback) => {
                callback(new Error('error'));
            }),
            end: jest.fn(),
        }));

        try {
            await DatabaseUtil.sendQuery('query');
        } catch (err) {
            expect(err).toEqual(new Error('error'));
        }
    });

    it('ends the connection', () => {
        DatabaseUtil.pool.end = jest.fn();

        DatabaseUtil.end();
        expect(DatabaseUtil.pool.end).toHaveBeenCalledTimes(1);
    });
});
