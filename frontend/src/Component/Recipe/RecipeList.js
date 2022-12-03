import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchRecipes, deleteRecipe, updateUser } from "../../Service/ApiService";
import { checkAuthFailure, getErrorDetails } from "../../Utils/ErrorUtils";
import ConfirmActionModal from "../Shared/ConfirmActionModal";
import { isNotEmpty, isAnInteger } from '../../Utils/StringUtils';
import { removeAuthenticatedUser, setAuthenticatedUser } from "../../Service/SessionService";
import M from "materialize-css";
import { UserContext } from "../../Service/UserProvider";
const ITEMS_PER_PAGE = 10;
const MAX_PAGES = 9; 
const MAX_FAVOURITE_RECIPES = 50;
const FAVOURITE_SEARCH_KEY = "id";

function RecipeList() {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const isAdmin = loggedInUser?.admin;
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchKey, setSearchKey] = useState('title');
    const [currentQuery, setCurrentQuery] = useState({ key: 'title', value: '' });

    useEffect(() => {
        var elems = document.querySelectorAll('.tooltipped');
        M.Tooltip.init(elems);
    }, [])

    useEffect(() => {
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }, []);

    useEffect(() => {
        getRecipes(currentPage, currentQuery);
    }, [currentPage, currentQuery]);

    const getRecipes = async (page, searchParams) => {
        await fetchRecipes(page, searchParams, ITEMS_PER_PAGE)
            .then(
                (res) => {
                    if (res.data.length === 0) {
                        M.toast({
                            html: '<strong>No results found</strong>', 
                            classes: 'red lighten-2' })
                    }
                    setRecipes(res.data);

                })
            .catch((err) => {
                M.toast({ 
                    html: `<strong>There was an error loading the recipes ${getErrorDetails(err)}</strong>`, 
                    classes: 'red lighten-2' })
                console.log(err)
            })
    };

    const handleSearchKeyChange = (event) => {
        document.getElementById('search-value').value = '';
        const searchValueDivElement = document.getElementById('search-value-div');
        if(event.target.value === FAVOURITE_SEARCH_KEY){
            searchValueDivElement.hidden = true;
        } else {
            searchValueDivElement.hidden = false;
        }
        setSearchKey(event.target.value);
    };

    const isSearchKeyNumericValue = () => {
        return (searchKey === 'difficulty' || searchKey === 'healthy_level');
    };

    const isSearchKeyBooleanValue = () => {
        return (searchKey === 'premade' || searchKey === 'vegetarian' || searchKey === 'batch');
    };

    const handleSearchRecipe = async (event) => {
        event.preventDefault();
        let searchParamValue = document.getElementById('search-value').value;
        if (isNotEmpty(searchParamValue)) {
            if (isSearchKeyBooleanValue()) {
                if (searchParamValue.toLowerCase().trim() === 'false') {
                    searchParamValue = Boolean(false);
                } else if (searchParamValue.toLowerCase().trim() === 'true') {
                    searchParamValue = Boolean(true);          
                } else {
                    M.toast({
                        html: `<strong>True or false are the only values accepted in the search box</strong>`,
                        classes: 'red lighten-2' 
                    })
                    return;
                }
            }
            if (isSearchKeyNumericValue()) {
                if (isAnInteger(searchParamValue.trim())) {
                    searchParamValue = parseInt(searchParamValue.trim());
                    if (searchParamValue < 1 || searchParamValue > 6) {
                        M.toast({
                            html: `<strong>A range of 1 to 5 are the only values accepted in the search box</strong>`,
                            classes: 'red lighten-2' 
                        })
                        return;
                    }
                } else {
                    M.toast({
                        html: `<strong>Whole number values are the only values accepted in the search box</strong>`,
                        classes: 'red lighten-2' 
                    })
                    return;
                }
            }

        } 
       if(searchKey===FAVOURITE_SEARCH_KEY){
            if(isUserFavouriteRecipesEmpty()){
                M.toast({
                    html: `<strong>You currently have no favourites</strong>`,
                    classes: 'red lighten-2' 
                })
                return;
            } 
            searchParamValue = loggedInUser.favourite_recipes;
        }
        setCurrentQuery(() => ({
            key: searchKey,
            value: searchParamValue
        }));
    };

    const handlePaginationClick = async (e) => {
        const event = e.nativeEvent;
        event.preventDefault();
        const pageNumber = event.target.closest('a').text;
        setCurrentPage(pageNumber - 1);
    };

    const handleChevronClick = async (e) => {
        const event = e.nativeEvent;
        event.preventDefault();
        const chevron = event.target.closest('i').textContent;
        if (chevron.includes('right') && currentPage !== MAX_PAGES) {
            setCurrentPage(currentPage + 1);
        } else if (chevron.includes('left') && currentPage !== 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleAuthFailure = () => {
        removeAuthenticatedUser();
        setLoggedInUser();
        setTimeout(() => navigate('/users/login'), 1000);
    }

    const handleDeleteClick = (event) => {
        event.preventDefault();
        if (isAdmin) {
            const recipeId = event.currentTarget.offsetParent.id;
            deleteRecipe(recipeId)
                .then((res) => {
                    M.toast({ html: `${res.data.message}` });
                    setTimeout(window.location.reload(), 1000);
                })
                .catch((err) => {
                    M.toast({
                        html: `<strong>There was an error deleting the recipe ${getErrorDetails(err)}</strong>`,
                        classes: 'red lighten-2' 
                    })
                    console.log(err);
                    if (checkAuthFailure(err)) {
                        handleAuthFailure();
                    }
                })
        }
    }

    const isUserFavouriteRecipesEmpty = () => {
        return loggedInUser?.favourite_recipes.length === 0 ;
    }

    const isUserFavouriteRecipesFull = () => {
        return loggedInUser?.favourite_recipes.length === MAX_FAVOURITE_RECIPES ;
    }

    const handleFavouriteClick = (event) => {
        if (loggedInUser) {
            if(isUserFavouriteRecipesFull()){
                M.toast({
                    html: `<strong>You have reached the maximum recipes that can be favourited (${MAX_FAVOURITE_RECIPES}).<br/>
                            Please remove a receipe from your favourites to add this one</strong>`,
                    classes: 'red lighten-2' 
                })
                return;
            }
            event.preventDefault();
            const row = event.target.closest('tr');
            const rowId = row.getAttribute("row_id");
            const index = loggedInUser?.favourite_recipes.indexOf(rowId);
            if (index > -1) {
                loggedInUser.favourite_recipes.splice(index, 1);
            } else {
                loggedInUser.favourite_recipes.push(rowId);
            }
            updateUser(loggedInUser._id, { favourite_recipes: loggedInUser.favourite_recipes })
                .then((res) => {
                    setLoggedInUser(res.data);
                    setAuthenticatedUser(res.data);
                })
                .catch((err) => {
                    M.toast({
                        html: `<strong>There was an error favouriting the recipe ${getErrorDetails(err)}</strong>`,
                        classes: 'red lighten-2' 
                    })
                    console.log(err);
                    if (checkAuthFailure(err)) {
                        handleAuthFailure();
                    }
                })
        }
    }

    return (
        <div className="row">
            <div className="col s12">
                <div className="row">
                    <div className="col s12">
                        <h5 className="teal-text text-lighten-2">Search Recipe</h5>
                        <div className="input-field col s3 center">
                            <select id="search-key" value={searchKey} onChange={handleSearchKeyChange}>
                                <option value="title">Name</option>
                                <option value={FAVOURITE_SEARCH_KEY}>Favourites</option>
                                <option value="core_ingredient">Core</option>
                                <option value="premade">Premade</option>
                                <option value="difficulty">Difficulty</option>
                                <option value="healthy_level">Healthy</option>
                                <option value="vegetarian">Veggie</option>
                                <option value="batch">Batch</option>
                            </select>
                        </div>
                        <div className="input-field col s4 center" id='search-value-div'>
                            <input className="validate" id="search-value" type={isSearchKeyNumericValue() ? "number" : "text"} maxLength="20" />
                            <label htmlFor="search-value">Search
                                <i className="material-icons left">search</i>
                            </label>
                        </div>
                        <div className="row">
                            <div className="col s12">
                                <button className="btn waves-light" onClick={handleSearchRecipe}>Search
                                    <i className="material-icons right">send</i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <table className="table-auto">
                        <thead>
                            <tr className="tooltipped" data-position="top" data-tooltip={loggedInUser ? "Double click row for details" : "Create an account to see more details"}>
                                <th>Name</th>
                                <th>Core</th>
                                <th>Premade</th>
                                <th>Difficulty</th>
                                <th>Healthy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipes.map((recipe) => {                                                                   
                                return (
                                    <tr key={recipe._id} row_id={recipe._id} onDoubleClick={() => { if (loggedInUser) { navigate('/recipes/' + recipe._id, { state: { recipe } }) } }}>
                                        <td id="title"><a href={recipe.url} target="_blank" rel="noopener noreferrer">{recipe.title}</a></td>
                                        <td id="core">{recipe.core_ingredient}</td>
                                        <td id="premade">{recipe.premade.toString()}</td>
                                        <td id="difficulty">{recipe.difficulty}</td>
                                        <td id="healthy">{recipe.healthy_level}</td>
                                        <td id="delete" className="tooltipped" data-position="top" data-tooltip="delete?" hidden={!isAdmin}><a href="#!" className="secondary-content modal-trigger" data-target={recipe._id}>
                                            <i className="material-icons left">delete</i></a></td>
                                        <td id="favourite" className="tooltipped" data-position="top" data-tooltip="mark favourite?" hidden={!loggedInUser}><a href="#!" className="secondary-content" onClick={handleFavouriteClick}>
                                            <i className="material-icons left">{loggedInUser?.favourite_recipes.includes(recipe._id) ? "star" : "star_border"}</i></a></td>
                                        <ConfirmActionModal id={recipe._id} header="Delete Recipe" content="Are you sure you want to delete this recipe? This cannot be undone." callback={handleDeleteClick}/>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div>
                    <ul className="pagination">
                        <li className={currentPage === 0 ? "disabled" : ""} onClick={handleChevronClick}><a href="#!"><i className="material-icons">chevron_left</i></a></li>
                        <li className={currentPage === 0 ? "active" : "waves-effect"} onClick={handlePaginationClick}><a href="#!">1</a></li>
                        <li className={currentPage === 1 ? "active" : "waves-effect"} onClick={handlePaginationClick}><a href="#!">2</a></li>
                        <li className={currentPage === 2 ? "active" : "waves-effect"} onClick={handlePaginationClick}><a href="#!">3</a></li>
                        <li className={currentPage === 3 ? "active" : "waves-effect"} onClick={handlePaginationClick}><a href="#!">4</a></li>
                        <li className={currentPage === 4 ? "active" : "waves-effect"} onClick={handlePaginationClick}><a href="#!">5</a></li>
                        <li className={currentPage === 5 ? "active" : "waves-effect"} onClick={handlePaginationClick}><a href="#!">6</a></li>
                        <li className={currentPage === 6 ? "active" : "waves-effect"} onClick={handlePaginationClick}><a href="#!">7</a></li>
                        <li className={currentPage === 7 ? "active" : "waves-effect"} onClick={handlePaginationClick}><a href="#!">8</a></li>
                        <li className={currentPage === 8 ? "active" : "waves-effect"} onClick={handlePaginationClick}><a href="#!">9</a></li>
                        <li className={currentPage === 9 ? "active" : "waves-effect"} onClick={handlePaginationClick}><a href="#!">10</a></li>
                        <li className={currentPage === 9 ? "disabled" : ""} o onClick={handleChevronClick}><a href="#!"><i className="material-icons">chevron_right</i></a></li>
                    </ul>
                </div>
                <div className="row"></div>
                <div hidden={!loggedInUser} className="row">
                    <div className="col s12">
                        <Link to="/recipes/new">
                            <button className="btn waves-effect waves-light"> Add Recipe
                                <i className="material-icons right">arrow_forward</i>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecipeList;