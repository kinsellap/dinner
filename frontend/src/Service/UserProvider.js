import { useState, useEffect } from 'react';
import UserContext from './UserContext';

const UserProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState();

    useEffect(() =>
        setLoggedInUser({
            first_name: 'Peter',
            last_name: 'Kinsella',
            admin: true
        }) , []);

    return (
        <UserContext.Provider value={[loggedInUser, setLoggedInUser]}>
            {children}
        </UserContext.Provider>
    );
}
export default UserProvider;