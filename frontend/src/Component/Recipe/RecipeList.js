import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"
import { fetchRecipes, deleteRecipe, updateUser } from "../../Service/ApiService";
import { checkAuthFailure, getErrorDetails } from "../../Utils/ErrorUtils"
import { isNotEmpty, isAnInteger } from '../../Utils/StringUtils';
import { removeAuthenticatedUser, setAuthenticatedUser } from "../../Service/SessionService"
import M from 'materialize-css'
import { UserContext } from "../../Service/UserProvider";

function RecipeList() {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const isAdmin = loggedInUser?.admin;
    const navigate = useNavigate();
    const itemsPerPage = 10;
    const maxPages = 4; //TODO get full amount of records on load and set max pages/number of paginations
    const [recipes, setRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchKey, setSearchKey] = useState('title');
    const [currentQuery, setCurrentQuery] = useState({ searchKey: 'title', searchValue: '' });

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
        await fetchRecipes(page, searchParams, itemsPerPage)
            .then(
                (res) => {
                    if (res.data.length === 0) {
                        M.toast({ html: 'No results found', classes: 'red' })
                    }
                    setRecipes(res.data);

                })
            .catch((err) => {
                M.toast({ html: `There was an error loading the recipes ${getErrorDetails(err)}`, classes: 'red' })
                console.log(err)
            })
    };

    const handleSearchKeyChange = (event) => {
        document.getElementById('search-value').value = '';
        setSearchKey(event.target.value);
    };

    const handleSearchRecipe = async (event) => {
        event.preventDefault();
        let searchParamValue = document.getElementById('search-value').value;
        if (isNotEmpty(searchParamValue)) {
            if (searchKey === 'premade') {
                if (searchParamValue.toLowerCase().trim() === 'false') {
                    searchParamValue = Boolean(false);
                } else if (searchParamValue.toLowerCase().trim() === 'true') {
                    searchParamValue = Boolean(true);
                } else {
                    M.toast({
                        html: `True or false are the only values accepted in the search box`,
                        classes: 'red'
                    })
                    return;
                }
            }
            if (searchKey === 'difficulty' || searchKey === 'healthy_level') {
                if (isAnInteger(searchParamValue.trim())) {
                    searchParamValue = parseInt(searchParamValue.trim());
                    if (searchParamValue < 0 || searchParamValue > 6) {
                        M.toast({
                            html: `A range of 1 to 5 are the only values accepted in the search box`,
                            classes: 'red'
                        })
                        return;
                    }
                } else {
                    M.toast({
                        html: `Whole number values are the only values accepted in the search box`,
                        classes: 'red'
                    })
                    return;
                }
            }
        }
        setCurrentQuery(() => ({
            searchKey: searchKey,
            searchValue: searchParamValue
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
        if (chevron.includes('right') && currentPage !== maxPages) {
            setCurrentPage(currentPage + 1);
        } else if (chevron.includes('left') && currentPage !== 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleAuthFailure = () => {
        setLoggedInUser();
        removeAuthenticatedUser();
        setTimeout(() => navigate('/users/login'), 1000);
    }

    const handleDeleteClick = (event) => {
        event.preventDefault();
        if (isAdmin) {
            const row = event.target.closest('tr');
            const rowId = row.getAttribute("row_id");
            deleteRecipe(rowId)
                .then((res) => {
                    M.toast({ html: `${res.data.message}` });
                    setTimeout(window.location.reload(), 1000);
                })
                .catch((err) => {
                    M.toast({
                        html: `There was an error deleting the recipe ${getErrorDetails(err)}`,
                        classes: 'red'
                    })
                    console.log(err);
                    if (checkAuthFailure(err)) {
                        handleAuthFailure();
                    }
                })
        }
    }

    const handleFavouriteClick = (event) => {
        event.preventDefault();
        const row = event.target.closest('tr');
        const rowId = row.getAttribute("row_id");
        const index = loggedInUser.favourite_recipes.indexOf(rowId);
        if (index > -1) {
            loggedInUser.favourite_recipes.splice(index, 1);
        } else {
            loggedInUser.favourite_recipes.push(rowId);
        }
        updateUser(loggedInUser._id, { favourite_recipes: loggedInUser.favourite_recipes })
            .then((res) => {
                setLoggedInUser(res.data);
                setAuthenticatedUser(res.data);
                setTimeout(window.location.reload(), 3000);
            })
            .catch((err) => {
                M.toast({
                    html: `There was an error favouriting the recipe ${getErrorDetails(err)}`,
                    classes: 'red'
                })
                console.log(err);
                if (checkAuthFailure(err)) {
                    handleAuthFailure();
                }
            })
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
                                <option value="core_ingredient">Core</option>
                                <option value="premade">Premade</option>
                                <option value="difficulty">Difficulty</option>
                                <option value="healthy_level">Healthy</option>
                            </select>
                        </div>
                        <div className="input-field col s4 center">
                            <input className="validate" id="search-value" type="text" maxLength="20" />
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
                            <tr className="tooltipped" data-position="top" data-tooltip="Double click row for details">
                                <th>Name</th>
                                <th>Core</th>
                                <th>Premade</th>
                                <th>Difficulty</th>
                                <th>Healthy</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipes.map((recipe) => {
                                return (
                                    <tr key={recipe._id} row_id={recipe._id} onDoubleClick={() => navigate('/recipes/' + recipe._id, { state: { recipe } })}>
                                        <td id="title"><a href={recipe.url} target="_blank" rel="noopener noreferrer">{recipe.title}</a></td>
                                        <td id="core">{recipe.core_ingredient}</td>
                                        <td id="premade">{recipe.premade.toString()}</td>
                                        <td id="difficulty">{recipe.difficulty}</td>
                                        <td id="healthy">{recipe.healthy_level}</td>
                                        <td id="delete" className="tooltipped" data-position="top" data-tooltip="delete?" hidden={!isAdmin}><a href="#!" className="secondary-content" onClick={handleDeleteClick}>
                                            <i className="material-icons left">delete</i></a></td>
                                        <td id="favourite" className="tooltipped" data-position="top" data-tooltip="mark favourite?" ><a href="#!" className="secondary-content" onClick={handleFavouriteClick}>
                                            <i className="material-icons left">{loggedInUser?.favourite_recipes.includes(recipe._id) ? "star" : "star_border"}</i></a></td>
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