import 'jest';
import UserService from '../services/UserService';
import * as AuthUtil from '../utility/AuthUtil';
import { Administrator, User, Client } from '../models';
import { UserTDG } from '../persistence';

const user: Administrator = {
    id: 'test',
    firstName: 'test',
    lastName: 'test',
    phone: 123456789,
    email: 'test@mail.com',
    address: 'test blvd',
    sessionId: 'test',
};

beforeEach(async () => {
    jest.clearAllMocks();
});

describe('UserService', () => {
    describe('login', () => {
        const spy = jest.spyOn(AuthUtil, 'authenticate');
        it('successfully logs in with valid credentials', async () => {
            spy.mockReturnValueOnce(user);

            process.env.JWT_KEY = 'test';
            const token = await UserService.login(user.email, 'testpassword');

            expect(token.length).toBeGreaterThan(0);
        });

        it('handles invalid or missing email', async () => {
            spy.mockImplementationOnce(() => {
                throw new Error('User does not exist');
            });
            try {
                const token = await UserService.login('', 'testpassword');
            } catch (err) {
                expect(err).toEqual(new Error('User does not exist'));
            }
        });

        it('handles invalid or missing password', async () => {
            spy.mockImplementationOnce(() => {
                throw new Error('Incorrect email or password');
            });
            try {
                const token = await UserService.login(user.email, '');
            } catch (err) {
                expect(err).toEqual(new Error('Incorrect email or password'));
            }
        });
    });

    describe('logout', () => {
        it('successfully logs out a user', async () => {
            UserTDG.update = jest.fn();
            const loggedOutUser = new User(
                user.id,
                user.firstName,
                user.lastName,
                user.phone,
                user.email,
                user.address,
                null,
            );
            await UserService.logout(user);
            expect(UserTDG.update).toHaveBeenCalledTimes(1);
            expect(UserTDG.update).toHaveBeenCalledWith(loggedOutUser);
        });

        it('handles null user passed into logout', async () => {
            try {
                await UserService.logout(null);
            } catch (err) {
                expect(err).toEqual(new Error('Undefined user'));
            }
            expect(UserTDG.update).not.toBeCalled();
        });
    });

    describe('register', () => {
        const spy = jest.spyOn(AuthUtil, 'register');
        it('successfully registers a new user (administrator)', async () => {
            const registeredUser = new Administrator(
                '',
                user.firstName,
                user.lastName,
                user.phone,
                user.email,
                user.address,
                '',
            );
            spy.mockReturnValueOnce(registeredUser);
            const result = await UserService.register(
                user.firstName,
                user.lastName,
                user.address,
                user.email,
                user.phone,
                'testpassword',
                true,
            );
            expect(result).toEqual(registeredUser);
            expect(result instanceof Administrator).toBeTruthy();
        });
        it('successfully registers a new user (client)', async () => {
            const registeredUser = new Client(
                '',
                user.firstName,
                user.lastName,
                user.phone,
                user.email,
                user.address,
                '',
            );
            spy.mockReturnValueOnce(registeredUser);
            const result = await UserService.register(
                user.firstName,
                user.lastName,
                user.address,
                user.email,
                user.phone,
                'testpassword',
                false,
            );
            expect(result).toEqual(registeredUser);
            expect(result instanceof Client).toBeTruthy();
        });

        it('handles missing parameters for register', async () => {
            try {
                const result = await UserService.register(
                    undefined,
                    user.lastName,
                    user.address,
                    user.email,
                    user.phone,
                    'testpassword',
                    true,
                );
            } catch (err) {
                expect(err).toEqual(new Error('Invalid parameters'));
            }
        });
    });

    describe('getUsers', () => {
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

        UserTDG.findAll = jest.fn((active: boolean) => {
            if (active) {
                return activeUsers;
            }
            return users;
        });

        it('successfully retrieve all active users', async () => {
            const result = await UserService.getUsers(true);
            expect(result.length).toEqual(2);
            expect(result).toEqual(activeUsers);
        });

        it('successfully retrieve all users', async () => {
            const result = await UserService.getUsers(false);
            expect(result.length).toEqual(3);
            expect(result).toEqual(users);
        });

        it('handles no active users or no users', async () => {
            UserTDG.findAll = jest.fn().mockReturnValueOnce([]);
            const result = await UserService.getUsers(true);
            expect(result.length).toEqual(0);
            expect(result).toEqual([]);
        });
    });
});
