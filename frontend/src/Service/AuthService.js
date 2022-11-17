import { loginUser } from './ApiService';

export const initialiseStorage = () => {
    sessionStorage.setItem('loggedInUser', '');
}

export const login = async (credentials) => {
    const res = await loginUser(credentials);
    sessionStorage.setItem('loggedInUser', JSON.stringify(res.data));
    return res.data;
};

export const getAuthenticatedUser = () => {
    const user = sessionStorage.getItem('loggedInUser');
    if (!user) {
        return;
    }
    return JSON.parse(user);
};

export const logout = () => {
    sessionStorage.removeItem('loggedInUser');
}
