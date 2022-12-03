import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../Service/UserProvider";
import { createRecipe, updateRecipe } from "../../Service/ApiService";
import { checkAuthFailure, getErrorDetails } from "../../Utils/ErrorUtils";
import { dateOnly } from "../../Utils/DateTimeUtils";
import { removeAuthenticatedUser } from "../../Service/SessionService";
import M from "materialize-css";
import { Link, useLocation, useNavigate } from 'react-router-dom';

function RecipeForm(props) {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state?.recipe;
    const isCreateMode = props.createMode;
    const [editable, setEditable] = useState(isCreateMode);
    const addFormattedData = (valuesToFormat) => {
        return {
            ...valuesToFormat,
            premade: Boolean(data.premade),
            vegetarian: Boolean(data.vegetarian),
            batch: Boolean(data.batch),
            date_added: dateOnly(data.date_added),
            date_updated: dateOnly(data.date_updated)
        };
    }

    const [values, setValues] = useState((!isCreateMode && data) ? addFormattedData(data) :
        {
            title: '',
            url: '',
            core_ingredient: 'Other',
            vegetarian: false,
            premade: false,
            batch: false,
            prep_time: '20-30 mins',
            cook_time: '45-60 mins',
            healthy_level: 1,
            difficulty: 1,
            notes: ''
        });

    useEffect(() => {
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }, [editable]);

    const handleTitleChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            title: event.target.value,
        }));
    };

    const handleUrlChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            url: event.target.value,
        }));
    };

    const handleCoreChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            core_ingredient: event.target.value,
        }));
    };

    const handleVegetarianChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            vegetarian: Boolean(event.target.checked),
        }));

    };

    const handlePremadeChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            premade: Boolean(event.target.checked),
        }));
    };

    const handleBatchChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            batch: Boolean(event.target.checked),
        }));
    };

    const handlePrepTimeChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            prep_time: event.target.value,
        }));
    };

    const handleCookTimeChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            cook_time: event.target.value,
        }));
    };

    const handleHealthyChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            healthy_level: event.target.value,
        }));
    };

    const handleDifficultyChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            difficulty: event.target.value,
        }));
    };

    const handleNotesChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            notes: event.target.value,
        }));
    };

    const handleEditClick = (event) => {
        setEditable(true);
    }

    const handleAuthFailure = () => {
        removeAuthenticatedUser();
        setLoggedInUser();
        setTimeout(() => navigate('/users/login'), 1000);
    }

    const doSubmit = async (event) => {
        event.preventDefault();
        if (loggedInUser && !isCreateMode && data) {
            await updateRecipe(data._id, { ...values, "updated_by": loggedInUser })
                .then((res) => {
                    M.toast({ html: `Recipe ${res.data.title} updated` })
                    setTimeout(() => navigate('/recipes'), 1000);
                })
                .catch((err) => {
                    M.toast({
                        html: `There was an error updating this recipe ${getErrorDetails(err)} `,
                        classes: 'red'
                    })
                    console.log(err)
                    if (checkAuthFailure(err)) {
                        handleAuthFailure();
                    }
                })
        } else if (loggedInUser && isCreateMode) {
            await createRecipe({ ...values, "added_by": loggedInUser })
                .then((res) => {
                    M.toast({ html: `Recipe ${res.data.title} created` })
                    setTimeout(() => navigate('/recipes'), 1000)
                })
                .catch((err) => {
                    M.toast({ html: `There was an error creating this recipe ${getErrorDetails(err)}`, classes: 'red' })
                    console.log(err)
                    if (checkAuthFailure(err)) {
                        handleAuthFailure();
                    }
                })
        }
    };

    return (
        <div className="row">
            <div className="col s12 ">
                <h5 className="teal-text text-lighten-2">{editable && isCreateMode ? "Add a new recipe" : "Recipe details"}</h5>
                <form onSubmit={doSubmit}>
                    <div className="row">
                        <div className="input-field col s12">
                            <input className={isCreateMode ? "validate" : ""} id="title" value={values.title} type="text" maxLength="20" onChange={handleTitleChange} required readOnly={!editable} />
                            <label className={isCreateMode ? "" : "active"} htmlFor="title">Recipe Name</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input className={isCreateMode ? "validate" : ""} id="url" value={values.url} type="url" onChange={handleUrlChange} maxLength="250" required readOnly={!editable} />
                            <label className={isCreateMode ? "" : "active"} htmlFor="url">Webpage</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s4">
                            <select className="validate" id="core-ingredient" value={values.core_ingredient} onChange={handleCoreChange} disabled={!editable}>
                                <option value="" disabled>Choose</option>
                                <option value="Beans">Beans</option>
                                <option value="Beef">Beef</option>
                                <option value="Chicken">Chicken</option>
                                <option value="Fish">Fish</option>
                                <option value="Grains">Grains</option>
                                <option value="Lentils">Lentils</option>]
                                <option value="Other">Other</option>
                                <option value="Pasta">Pasta</option>
                                <option value="Pork">Pork</option>
                            </select>
                            <label>Core Ingredient</label>
                        </div>
                        <div className="input-field col s4">
                            <select className="validate" id="prep-time" value={values.prep_time} onChange={handlePrepTimeChange} disabled={!editable}>
                                <option value="" disabled>Choose</option>
                                <option value="< 10 mins">10 mins or less</option>
                                <option value="10-20 mins">10 to 20 mins</option>
                                <option value="20-30 mins">20 to 30 mins</option>
                                <option value="30-40 mins">30 to 40 mins</option>
                                <option value="> 40 mins">Greater than 40 mins</option>
                            </select>
                            <label htmlFor="prep-time">Prep Time</label>
                        </div>
                        <div className="input-field col s4">
                            <select className="validate" id="cook-time" value={values.cook_time} onChange={handleCookTimeChange} disabled={!editable}>
                                <option value="" disabled>Choose</option>
                                <option value="< 30 mins">30 mins or less</option>
                                <option value="30-45 mins">30 to 45 mins</option>
                                <option value="45-60 mins">45 to 60 mins</option>
                                <option value="60-75 mins">60 to 75 mins</option>
                                <option value="> 75 mins">Greater than 75 mins</option>
                            </select>
                            <label htmlFor="cook-time">Cook Time</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s4">
                            <label >
                                <input id="vegetarian" checked={values.vegetarian} type="checkbox" onChange={handleVegetarianChange} disabled={!editable} />
                                <span>Vegetarian </span>
                            </label>
                        </div>
                        <div className="input-field col s4">
                            <label >
                                <input id="premade" checked={values.premade} type="checkbox" onChange={handlePremadeChange} disabled={!editable} />
                                <span>Premade</span>
                            </label>
                        </div>
                        <div className="input-field col s4">
                            <label >
                                <input id="batch" checked={values.batch} type="checkbox" onChange={handleBatchChange} disabled={!editable} />
                                <span>Batch</span>
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <div className="range-field">
                                <input type="range" id="difficulty" min="1" max="5" value={values.difficulty} onChange={handleDifficultyChange} disabled={!editable} />
                                <label htmlFor="difficulty"> Note: 1 is easiest and 5 is hardest
                                    <br />Difficulty = </label>
                                <output>{values.difficulty}</output>
                            </div>
                        </div>
                        <div className="input-field col s6">
                            <div className="range-field">
                                <input type="range" id="healthy_level" min="1" max="5" value={values.healthy_level} onChange={handleHealthyChange} disabled={!editable} />
                                <label htmlFor="healthy_level" >Note: 1 is most healthy and 5 is least healthy
                                    <br /> Healthy = </label>
                                <output>{values.healthy_level}</output>
                            </div>
                        </div>
                    </div>
                    <div className="row" hidden={isCreateMode}>
                        <div className="col s6">
                            <label htmlFor="date-added">Date Added</label>
                            <textarea id="date-added" className="materialize-textarea" value={values.date_added} readOnly></textarea>
                        </div>
                        <div className="col s6">
                            <label htmlFor="added-by">Added By</label>
                            <textarea id="added-by" className="materialize-textarea" value={values.added_by?.email_address} readOnly></textarea>
                        </div>
                    </div>
                    <div className="row" hidden={isCreateMode}>
                        <div className="col s6">
                            <label htmlFor="date-updated">Date Updated</label>
                            <textarea id="date-updated" className="materialize-textarea " value={values.date_updated} readOnly></textarea>
                        </div>
                        <div className="col s6">
                            <label htmlFor="updated-by">Updated By</label>
                            <textarea id="updated-by" className="materialize-textarea" value={values.updated_by?.email_address} readOnly></textarea>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <textarea id="notes" className="materialize-textarea{height: 12rem;}" value={values.notes} onChange={handleNotesChange} maxLength="500" readOnly={!editable}></textarea>
                            <label className={isCreateMode ? "" : "active"} htmlFor="notes">Notes</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s8">
                            <Link to="/recipes">
                                <button className="btn waves-effect waves-light" type="button"> Back
                                    <i className="material-icons left">arrow_back</i>
                                </button>
                            </Link>
                        </div>
                        <div hidden={!editable} className="col s4">
                            <button className="btn waves-light right" type="submit">
                                {editable && !isCreateMode ? "Update Recipe" : "Add Recipe"}
                                <i className="material-icons right">add_circle</i>
                            </button>
                        </div>
                        <div hidden={editable || !loggedInUser} className="col s4">
                            <button className="btn waves-effect waves-light right" type="button" onClick={handleEditClick} >Edit Recipe
                                <i className="material-icons right">edit</i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RecipeForm;

