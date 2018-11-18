import 'jest';
import supertest from 'supertest';

import server from '../server';

import { generateToken } from '../utility/AuthUtil';

import UserService from '../services/UserService';
import { Administrator, User } from '../models';

jest.mock('../middlewares/injectUser');

// Must create a fake token to pass auth check
let token: string;

beforeAll(() => {
    console.log = jest.fn();
});

beforeEach(async () => {
    process.env.JWT_KEY = 'test';
    const user: Administrator = new Administrator(
        '1',
        'Test',
        'Test',
        0,
        'Test',
        'Test',
        '12345',
    );
    token = await generateToken({ user, isAdmin: true });
    jest.clearAllMocks();
});

const user: Administrator = new Administrator(
    '1',
    'Test',
    'Test',
    1,
    'Test',
    'Test',
    '12345',
);

describe('UserController', () => {
    describe('PUT /users', () => {
        const request = {
            firstName: 'Test',
            lastName: 'Test',
            email: 'Test',
            address: 'Test',
            phone: 1,
            password: 'Test',
            isAdmin: true,
        };
        it('successfully registers a new user', async () => {
            UserService.register = jest.fn().mockReturnValueOnce(user);

            const response = await supertest(server)
                .put('/users')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send(request)
                .expect(200);
            expect(response.body.registeredUser).toEqual(user);
        });
        it('requires admin rights', async () => {
            await supertest(server)
                .put('/users')
                .expect(403);
        });
        it('handles missing or invalid attribute', async () => {
            const request = {
                firstName: 'Test',
                lastName: 'Test',
                email: 'Test',
                address: 'Test',
                phone: 0,
                password: 'Test',
                isAdmin: true,
            };
            await supertest(server)
                .put('/users')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send(request)
                .expect(400);
        });
        it('handles bad request error', async () => {
            UserService.register = jest.fn(() => {
                throw new Error();
            });
            await supertest(server)
                .put('/users')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send(request)
                .expect(500);
        });
    });
    describe('POST /users/login', () => {
        it('successfully authenticates user', async () => {
            UserService.login = jest.fn().mockReturnValueOnce(token);
            const request = {
                email: 'Test',
                password: 'Test',
            };
            const response = await supertest(server)
                .post('/users/login')
                .set('Accept', 'application/json')
                .send(request)
                .expect(200);
            expect(response.body.token).toEqual(token);
        });
        it('handles missing email/password', async () => {
            const request = {
                email: '',
                password: 'Test',
            };
            await supertest(server)
                .post('/users/login')
                .set('Accept', 'application/json')
                .send(request)
                .expect(400);
        });
        it('handles bad request error', async () => {
            UserService.login = jest.fn(() => {
                throw new Error();
            });
            const request = {
                email: 'Test',
                password: 'Test',
            };

            await supertest(server)
                .post('/users/login')
                .set('Accept', 'application/json')
                .send(request)
                .expect(500);
        });
    });
    describe('GET /users', () => {
        const users: User[] = [
            {
                id: 'test1',
                firstName: 'test1',
                lastName: 'test1',
                phone: 123456789,
                email: 'test1@mail.com',
                address: 'test1 blvd',
                sessionId: 'test1',
            },
            {
                id: 'test2',
                firstName: 'test2',
                lastName: 'test2',
                phone: 123456789,
                email: 'test2@mail.com',
                address: 'test2 blvd',
                sessionId: 'test2',
            },
            {
                id: 'test3',
                firstName: 'test3',
                lastName: 'test3',
                phone: 123456789,
                email: 'test3@mail.com',
                address: 'test3 blvd',
                sessionId: 'test3',
            },
        ];
        const activeUsers: User[] = [
            {
                id: 'test2',
                firstName: 'test2',
                lastName: 'test2',
                phone: 123456789,
                email: 'test2@mail.com',
                address: 'test2 blvd',
                sessionId: 'test2',
            },
            {
                id: 'test3',
                firstName: 'test3',
                lastName: 'test3',
                phone: 123456789,
                email: 'test3@mail.com',
                address: 'test3 blvd',
                sessionId: 'test3',
            },
        ];
        it('successfully returns list of active users', async () => {
            UserService.getUsers = jest.fn().mockReturnValueOnce(activeUsers);
            const response = await supertest(server)
                .get('/users?active=true')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            expect(response.body.length).toEqual(2);
            expect(response.body).toEqual(activeUsers);
        });
        it('successfully returns list of all users', async () => {
            UserService.getUsers = jest.fn().mockReturnValueOnce(users);
            const response = await supertest(server)
                .get('/users')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            expect(response.body.length).toEqual(3);
            expect(response.body).toEqual(users);
        });
        it('requires admin rights', async () => {
            await supertest(server)
                .get('/users')
                .expect(403);
        });
        it('handles bad request error', async () => {
            UserService.getUsers = jest.fn(() => {
                throw new Error();
            });
            await supertest(server)
                .get('/users')
                .set('Authorization', `Bearer ${token}`)
                .expect(500);
        });
    });
    describe('POST /users/logout', () => {
        it('successfully logs a user out', async () => {
            UserService.logout = jest.fn();
            await supertest(server)
                .post('/users/logout')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
        });
        it('requires user to be authenticated', async () => {
            await supertest(server)
                .post('/users/logout')
                .expect(401);
        });
        it('handles bad request error', async () => {
            UserService.logout = jest.fn(() => {
                throw new Error();
            });
            await supertest(server)
                .post('/users/logout')
                .set('Authorization', `Bearer ${token}`)
                .expect(500);
        });
    });
});
