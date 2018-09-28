import * as decode from 'jwt-decode';

export const isAuthenticated = () => {
    const token = localStorage.getItem('Authorization');
    try {
        decode(token);
        return true;
    } catch(err) {
        return false;
    }
};
