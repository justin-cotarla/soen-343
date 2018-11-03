import * as decode from 'jwt-decode';

export const getDecodedToken = () => {
    const token = localStorage.getItem('Authorization');
    try {
        return decode(token);
    } catch (err) {
        return null;
    }
}

export const isAuthenticated = () => {
    try {
        const token = getDecodedToken();
        if (token) {
            return true;
        }

        return false;
    } catch(err) {
        return false;
    }
};

export const isAdmin = () => {
    try {
        const { isAdmin } = getDecodedToken();
        return isAdmin;
    } catch (err) {
        return false;
    }
};

export const invalidate = () => {
    localStorage.removeItem('Authorization');
    window.location.reload();
}
