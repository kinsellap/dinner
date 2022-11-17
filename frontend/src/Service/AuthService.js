
const LOGGED_IN_USER = 'loggedInUser'

export const setAuthenticatedUser = async (data) => {
    sessionStorage.setItem(LOGGED_IN_USER, JSON.stringify(data));
};

export const getAuthenticatedUser = () => {
    const user = sessionStorage.getItem(LOGGED_IN_USER);
    if (!user) {
        return;
    }
    return JSON.parse(user);
};

export const removeAuthenticatedUser = () => {
    sessionStorage.removeItem(LOGGED_IN_USER);
}
