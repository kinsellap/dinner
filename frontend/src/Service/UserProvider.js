import { useState, useEffect, createContext } from "react";
import { getAuthenticatedUser } from "./SessionService";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState();

    useEffect(() => {
        setLoggedInUser(getAuthenticatedUser());
    }, [])

    return (
        <UserContext.Provider value={[loggedInUser, setLoggedInUser]}>
            {children}
        </UserContext.Provider>
    );
}