import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"
import { fetchRecipes, getErrorDetails, deleteRecipe } from "../../Service/ApiService";
import M from 'materialize-css'
import {UserContext} from "../../Service/UserProvider";

function RecipeList() {
    const [loggedInUser] = useContext(UserContext);
    const isAdmin = loggedInUser?.admin;
    const navigate = useNavigate();
    const itemsPerPage = 5;
    const maxPages = 4; //TODO get full amount of records on load and set max pages/number of paginations
    const [recipes, setRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentQuery, setCurrentQuery] = useState('');

    useEffect(() => {
        var elems = document.querySelectorAll('.tooltipped');
        M.Tooltip.init(elems);
    },[])

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
                M.toast({ html:`There was an error loading the recipes ${getErrorDetails(err)}`, classes: 'red' })
                console.log(err)
            })
    };

    const handleSearchRecipe = async (event) => {
        event.preventDefault();
        let searchParam = document.getElementById('title-search').value;
        setCurrentQuery(searchParam);
    };

    const handlePaginationClick = async (e) => {
        const event = e.nativeEvent;
        event.preventDefault();
        const pageNumber = event.target.closest('a').text;
        setCurrentPage(pageNumber-1);
    };

    const handleChevronClick = async (e) => {
        const event = e.nativeEvent;
        event.preventDefault();
        const chevron = event.target.closest('i').textContent;
        if (chevron.includes('right') && currentPage !== maxPages) {
            setCurrentPage(currentPage + 1);
        } else if(chevron.includes('left') && currentPage !== 0){
            setCurrentPage(currentPage - 1);
        }
    };

    const handleDeleteClick = (event) => {
        event.preventDefault();
        if (isAdmin) {
            const row = event.target.closest('tr');
            const rowId = row.getAttribute("row_id");
            deleteRecipe(rowId)
                .then((res) => {
                    M.toast({ html: `${res.data.message}` });
                    setTimeout(window.location.reload(),1000);
                })
                .catch((err) => {
                    M.toast({ html: `There was an error deleting the recipe ${getErrorDetails(err)}`,
                     classes: 'red' })
                    console.log(err)
                })
        }
    }

    return (
        <div className="row">
            <div className="col s12">
                <div className="row">
                    <div className="col s12">
                        <h5 className="teal-text text-lighten-2">Search Recipe</h5>
                        <div className="input-field col s4 center">
                            <input className="validate" id="title-search" type="text" maxLength="20" />
                            <label htmlFor="title-search">Search Name
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
                                        <td id="delete" className="tooltipped" data-position="right" data-tooltip="delete?" hidden={!isAdmin}><a href="#!" className="secondary-content" onClick={handleDeleteClick}>
                                        <i className="material-icons left">delete</i></a></td>
                                        <td id="details"><a href="#!" className="secondary-content" onClick={() => navigate('/recipes/' + recipe._id, { state: { recipe } })}>
                                        <i className="material-icons left">remove_red_eye</i></a></td>

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
                        <li className={currentPage === 4 ? "disabled" : ""} o onClick={handleChevronClick}><a href="#!"><i className="material-icons">chevron_right</i></a></li>
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

//       {
//         Header: "Notes",
//         id: 'notes',
//         accessor: "notes",
//         Cell: ({ row }) => {
//           let output = '';
//           row.original.notes.forEach(function (item, index) {
//             if (output.length >= 400) {
//               output += '...';
//               return output;
//             }
//             output += (item += index === row.original.notes.length - 1 ? '' : ' | ')
//           })
//           return output;
//         }
//       },


export default RecipeList;