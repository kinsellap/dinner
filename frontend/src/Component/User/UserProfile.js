import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../Service/UserProvider";
import { checkAuthFailure, getErrorDetails } from "../../Utils/ErrorUtils";
import { capitaliseFirstLetter } from "../../Utils/StringUtils";
import { getCountRecipesUpdated, getCountRecipesAdded, deleteUser, updateUser } from "../../Service/ApiService";
import { setAuthenticatedUser, setAuthToken } from "../../Service/SessionService";
import M from 'materialize-css'

function UserProfile(props) {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const [countRecipesAdded, setCountRecipesAdded] = useState(0);
    const [countRecipesUpdated, setCountRecipesUpdated] = useState(0);

    useEffect(() => {
        const userCountRecipesAdded = async (userId) => {
            await getCountRecipesAdded(userId)
                .then(
                    (res) => {
                        if (res.data.length !== 0) {
                            setCountRecipesAdded(res.data);
                        }
                    })
                .catch((err) => {
                    M.toast({ html: `There was an error loading the added recipe count ${getErrorDetails(err)}`, classes: 'red' })
                    console.log(err)
                })
        };
        if (loggedInUser) {
            userCountRecipesAdded(loggedInUser._id);
        }
    }, [countRecipesAdded, loggedInUser]);

    useEffect(() => {
        const userCountRecipesUpdated = async (userId) => {
            await getCountRecipesUpdated(userId)
                .then(
                    (res) => {
                        if (res.data.length !== 0) {
                            setCountRecipesUpdated(res.data);
                        }
                    })
                .catch((err) => {
                    M.toast({ html: `There was an error loading the updated recipe count ${getErrorDetails(err)}`, classes: 'red' })
                    console.log(err)
                })
        };
        if (loggedInUser) {
            userCountRecipesUpdated(loggedInUser._id);
        }
    }, [countRecipesAdded, loggedInUser]);

    return (
        <div className="row">
            <div className="col s12">
                <h4 className="teal-text text-lighten-2">Hello {capitaliseFirstLetter(loggedInUser?.first_name)}</h4>
                <div className="row">
                    <div className="col s6 center">
                        <h5>  {countRecipesAdded}</h5>
                        <p>Recipes Added</p>
                    </div>
                    <div className="col s6 center">
                    <h5>  {countRecipesUpdated}</h5>
                       <p>Recipes Updated</p>
                    </div>
                </div>
            </div>
        </div>);
}

export default UserProfile;