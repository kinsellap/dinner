import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../Service/UserProvider";
import { useNavigate } from "react-router-dom"
import { checkAuthFailure, getErrorDetails } from "../../Utils/ErrorUtils";
import { capitaliseFirstLetter, isNotEmpty } from "../../Utils/StringUtils";
import { removeAuthenticatedUser, setAuthenticatedUser } from "../../Service/SessionService"
import { getCountRecipesUpdated, getCountRecipesAdded, deleteUser, updateUser, changePassword } from "../../Service/ApiService";
import { dateOnly } from "../../Utils/DateTimeUtils";
import ImageUploading from 'react-images-uploading';
import M from 'materialize-css'

function UserProfile() {
    const navigate = useNavigate();
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const [passwordChange, setPasswordChange] = useState(false);
    const [countRecipesAdded, setCountRecipesAdded] = useState(0);
    const [countRecipesUpdated, setCountRecipesUpdated] = useState(0);
    const [profilePicture, setProfilePicture] = useState([]);
    const [passwordValues, setPasswordValues] = useState({
        password: '',
        new_password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

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
    }, []);

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
    }, []);

    const handleShowPasswordClick = (event) => {
        event.preventDefault();
        setShowPassword(!showPassword);
    }

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
        updateUser(loggedInUser._id, { favourite_recipes: [] })
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


    const handleCurrentPasswordChange = (event) => {
        event.persist();
        setPasswordValues((values) => ({
            ...values,
            password: event.target.value,
        }));
    };

    const handleNewPasswordChange = (event) => {
        event.persist();
        setPasswordValues((values) => ({
            ...values,
            new_password: event.target.value,
        }));
    };

    const handleChangePasswordClick = (event) => {
        event.preventDefault();
        setPasswordChange(true);
    }

    const handleCancelChangePasswordClick = (event) => {
        event.preventDefault();
        setPasswordValues(() => ({
            new_password: '',
            password: ''
        }));
        setPasswordChange(false);
    }

    const doPasswordUpdate = (event) => {
        event.preventDefault();
        if (loggedInUser && isNotEmpty(passwordValues.password) && isNotEmpty(passwordValues.new_password)) {
            const { email_address, _id } = loggedInUser;
            const { password, new_password } = passwordValues;
            changePassword({ email_address, _id, password, new_password })
                .then((res) => {
                    setLoggedInUser(res.data);
                    setAuthenticatedUser(res.data);
                    setTimeout(window.location.reload(), 1000);
                })
                .catch((err) => {
                    M.toast({
                        html: `There was an error changing your password ${getErrorDetails(err)}`,
                        classes: 'red'
                    })
                    console.log(err);
                    if (checkAuthFailure(err)) {
                        handleAuthFailure();
                    }
                })
        }
    }

    const handleAuthFailure = () => {
        removeAuthenticatedUser();
        setLoggedInUser();
        setTimeout(() => navigate('/users/login'), 1000);
    }

    const getCountRecipesFavourited = () => {
        return loggedInUser ? loggedInUser.favourite_recipes.length : 0;
    }

    const getProfileName = () => {
        return loggedInUser ? capitaliseFirstLetter(loggedInUser?.first_name) + "'s Profile" : '';
    }

    const onImageChange = (image) => {
        setProfilePicture(image);
        const file = image[0];
        if (loggedInUser && file) {
            updateUser(loggedInUser._id, { profile_picture: {data: file.data_url, contentType: 'image/jpeg'} })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    M.toast({
                        html: `There was an error uploading your photo ${getErrorDetails(err)}`,
                        classes: 'red'
                    })
                    console.log(err);
                    if (checkAuthFailure(err)) {
                        handleAuthFailure();
                    }
                })
        }
    };

    return (
        <div className="row">
            <div className="col s12">
                <h4 className="teal-text text-lighten-2">{getProfileName()}</h4>
                <form onSubmit={doPasswordUpdate}>
                    <div className="row">
                        <div className="col s2 left teal lighten-2 circle" style={{ color: "white" }}>
                            <h5 className="center"> {countRecipesAdded}</h5>
                            <p className="center"> Recipes <br /><i className="material-icons">add_circle</i></p>
                        </div>
                        <div className="col s2  circle" style={{ outline: "2px solid #4db6ac", color: "#4db6ac", marginLeft: "25%" }}>
                            <h5 className="center"> {getCountRecipesFavourited()}</h5>
                            <p className="center" >Recipes <br /><i className="material-icons">star</i></p>
                        </div>

                        <div className="col s2 right  teal lighten-2 circle" style={{ color: "white" }}>
                            <h5 className="center">  {countRecipesUpdated}</h5>
                            <p className="center">Recipes <br /><i className="material-icons">edit</i></p>
                        </div>
                    </div>
                    <div className="row col s12 center " >
                        {profilePicture.map((image, index) => (
                            <div key={index} className="image-item"><img src={image.data_url} alt="" width="100" /></div>
                        ))}
                    </div>
                    <div className="row">
                        <ImageUploading value={profilePicture} onChange={onImageChange} maxNumber={1} dataURLKey="data_url" acceptType={["jpg"]}>
                            {({ onImageUpload, onImageRemove }) => (
                                <div className="upload__image-wrapper center">
                                    <button className=" btn waves-light center" type="button" onClick={onImageUpload}>Update Photo</button>
                                    &nbsp;
                                    <button className="btn waves-light center" type="button" onClick={onImageRemove}>Remove Photo</button>
                                </div>
                            )}
                        </ImageUploading>
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
                    <div hidden={!passwordChange} className="row">
                        <div className="input-field col s5">
                            <input id="current-password" type={showPassword ? "text" : "password"} minLength="5" maxLength="20" required autoComplete="on" value={passwordValues.password} onChange={handleCurrentPasswordChange} />
                            <label htmlFor="current-password">Current Password</label>
                        </div>
                        <div className="input-field col s5">
                            <input id="new-password" type={showPassword ? "text" : "password"} minLength="5" maxLength="20" required autoComplete="on" value={passwordValues.new_password} onChange={handleNewPasswordChange} />
                            <label htmlFor="new-password">New Password</label>
                        </div>
                        <div className="input-field col s2">
                            <a href="#!" className="secondary-content left" onClick={handleShowPasswordClick}>
                                <i className="material-icons">{showPassword ? "visibility_off" : "visibility"}</i>
                            </a>
                        </div>
                    </div>
                    <div className="row">
                        <div hidden={!loggedInUser || passwordChange} className="col s4 left">
                            <button className="btn waves-light left" type="button" onClick={handleDeleteClick} >Delete Account
                                <i className="material-icons right">delete_forever</i>
                            </button>
                        </div>
                        <div hidden={!loggedInUser || passwordChange} className="col s4 center">
                            <button className="btn waves-light center" type="button" onClick={handleChangePasswordClick} >Change Password
                                <i className="material-icons right"></i>
                            </button>
                        </div>
                        <div hidden={!loggedInUser || !passwordChange} className="col s4 right">
                            <button className="btn waves-light right" type="submit">Submit
                                <i className="material-icons right"></i></button>
                        </div>
                        <div hidden={!loggedInUser || !passwordChange} className="col s4 left">
                            <button className="btn waves-light left" type="button" onClick={handleCancelChangePasswordClick}>Cancel
                                <i className="material-icons right"></i></button>
                        </div>
                        <div hidden={!loggedInUser || passwordChange} className="col s4 right">
                            <button className="btn waves-light right" type="button" onClick={handleClearFavouritesClick} >Clear Favourites
                                <i className="material-icons right">delete_sweep</i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>);
}

export default UserProfile;