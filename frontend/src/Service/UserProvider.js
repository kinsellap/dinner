import { useState, useEffect, createContext } from 'react';
import {getAuthenticatedUser} from './AuthService';
export const UserContext = createContext();


export const UserProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState();

    useEffect(() => {
        setLoggedInUser(getAuthenticatedUser());
    },[])
    
    return (
        <UserContext.Provider value={[loggedInUser, setLoggedInUser]}>
            {children}
        </UserContext.Provider>
    );
}