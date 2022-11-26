
const LOGGED_IN_USER = 'loggedInUser'
const AUTH_TOKEN = 'authToken'

export const setAuthenticatedUser = async (user) => {
    console.log("setting session")
    sessionStorage.setItem(LOGGED_IN_USER, JSON.stringify(user));
};

export const setAuthToken = async (token) => {
    sessionStorage.setItem(AUTH_TOKEN, JSON.stringify(token));
};

export const getAuthenticatedUser = () => {
    const user = sessionStorage.getItem(LOGGED_IN_USER);
    if (!user) {
        return;
    }
    return JSON.parse(user);
};

export const getAuthToken = () => {
    const authToken = sessionStorage.getItem(AUTH_TOKEN);
    if (!authToken) {
        return;
    }
    return JSON.parse(authToken);
};

export const removeAuthenticatedUser = () => {
    sessionStorage.removeItem(LOGGED_IN_USER);
    sessionStorage.removeItem(AUTH_TOKEN);
}
