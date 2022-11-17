import { useState, useEffect, createContext } from 'react';
import { initialiseStorage, getAuthenticatedUser } from './AuthService';
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState();

    // useEffect(() => {
    //     checkLoggedInUser(loggedInUser);
    // }, [loggedInUser]);

    // const checkLoggedInUser = (currentUser) => {
    //     console.log(currentUser);
    //     if (!currentUser) {
    //         let userLoggedIn = getAuthenticatedUser();
    //         if (!userLoggedIn) {
    //             initialiseStorage();
    //             userLoggedIn = ''
    //         }
    //         setLoggedInUser(userLoggedIn);
    //     }
    // };
    return (
        <UserContext.Provider value={[loggedInUser, setLoggedInUser]}>
            {children}
        </UserContext.Provider>
    );
}