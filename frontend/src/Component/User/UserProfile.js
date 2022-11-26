import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../Service/UserProvider";
import { useNavigate } from "react-router-dom"
import { checkAuthFailure, getErrorDetails } from "../../Utils/ErrorUtils";
import { capitaliseFirstLetter } from "../../Utils/StringUtils";
import { removeAuthenticatedUser, setAuthenticatedUser } from "../../Service/SessionService"
import { getCountRecipesUpdated, getCountRecipesAdded, deleteUser, updateUser } from "../../Service/ApiService";
import { dateOnly } from "../../Utils/DateTimeUtils";
import M from 'materialize-css'

function UserProfile() {
    const navigate = useNavigate();
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

    const handleDeleteClick = (event) => {
        //TODO pop up double check
        event.preventDefault();
        deleteUser(loggedInUser._id)
            .then(() => {
                removeAuthenticatedUser();
                setLoggedInUser();
                setTimeout(() => navigate('/users/register'), 1000);
            })
            .catch((err) => {
                M.toast({
                    html: `There was an error deleting this user ${getErrorDetails(err)}`,
                    classes: 'red'
                })
                console.log(err);
                if (checkAuthFailure(err)) {
                    handleAuthFailure();
                }
            })
    }

    const handleClearFavouritesClick = (event) => {
        //TODO pop up double check
        event.preventDefault();
        updateUser(loggedInUser._id, { favourite_recipes:[]})
            .then((res) => {
                setLoggedInUser(res.data);
                setAuthenticatedUser(res.data);
                setTimeout(window.location.reload(), 1000);
            })
            .catch((err) => {
                M.toast({
                    html: `There was an error clearing your favourites ${getErrorDetails(err)}`,
                    classes: 'red'
                })
                console.log(err);
                if (checkAuthFailure(err)) {
                    handleAuthFailure();
                }
            })
    }

    const handleAuthFailure = () => {
        removeAuthenticatedUser();
        setLoggedInUser();
        setTimeout(() => navigate('/users/login'), 1000);
    }

    return (
        <div className="row">
            <div className="col s12">
                <h4 className="teal-text text-lighten-2">{capitaliseFirstLetter(loggedInUser?.first_name)}'s Profile</h4>
                <div className="row">

                    <div className="col s3 center teal lighten-2 circle" style={{ color: "white" }}>
                        <h5>  {countRecipesAdded}</h5>
                        <p>Recipes Added</p>
                    </div>
                    <div className="col s1" />
                    <div className="col s3 center circle" style={{ outline: "2px solid #4db6ac", color: "#4db6ac" }}>
                        <h5>  {loggedInUser?.favourite_recipes.length}</h5>
                        <p>Recipes Favourited</p>
                    </div>
                    <div className="col s1" />
                    <div className="col s3 center  teal lighten-2 circle" style={{ color: "white" }}>
                        <h5>  {countRecipesUpdated}</h5>
                        <p>Recipes Updated</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <label htmlFor="first-name">First Name</label>
                        <textarea id="first-name" className="materialize-textarea" value={loggedInUser?.first_name} type="text" maxLength="20" readOnly />
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <label htmlFor="last-name">Last Name</label>
                        <textarea id="last-name" className="materialize-textarea" value={loggedInUser?.last_name} type="text" maxLength="20" readOnly />
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <label htmlFor="email-address" data-error="wrong" data-success="right">Email</label>
                        <textarea id="email-address" className="materialize-textarea" value={loggedInUser?.email_address} type="email" readOnly />
                    </div>
                </div>
                <div className="row">
                    <div className="col s6">
                        <label htmlFor="date-added">Date Added</label>
                        <textarea id="date-added" className="materialize-textarea" value={dateOnly(loggedInUser?.date_added)} readOnly></textarea>
                    </div>
                    <div className="col s6">
                        <label htmlFor="date-updated">Date Updated</label>
                        <textarea id="date-updated" className="materialize-textarea" value={dateOnly(loggedInUser?.date_updated)} readOnly></textarea>
                    </div>
                </div>
                <div className="row">
                    <div hidden={!loggedInUser} className="col s6">
                        <button className="btn waves-light left" type="button" onClick={handleDeleteClick} >Delete Account
                            <i className="material-icons right">delete_forever</i>
                        </button>
                    </div>
                    <div hidden={!loggedInUser} className="col s6">
                        <button className="btn waves-light right" type="button" onClick={handleClearFavouritesClick} >Clear Favourites
                            <i className="material-icons right">delete_sweep</i>
                        </button>
                    </div>
                </div>
            </div>
        </div>);
}

export default UserProfile;