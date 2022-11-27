import axios from 'axios'
import { getAuthToken } from "../Service/SessionService";
import { isNotEmpty } from '../Utils/StringUtils';
const serverUrl = 'http://localhost:8080/api'
const usersEndpoint = serverUrl + '/users/'
const recipesEndpoint = serverUrl + '/recipes/'

export const createUser = async (data) => {
    return await axios.post(usersEndpoint, data);
}

export const getUser = async (query) => {
    const token = getAuthToken();
    let url = usersEndpoint;
    if (isNotEmpty(query)) {
        url += "?name=" + query;
    }
    return await axios.get(url, contentAuthHeaders(token));
}

export const loginUser = async (credentials) => {
    return await axios.post(usersEndpoint + "login", credentials);
}

export const updateUser = async (userId, data) => {
    const token = getAuthToken();
    return await axios.put(usersEndpoint + userId, data, contentAuthHeaders(token));
}

export const changePassword = async (data) => {
    const token = getAuthToken();
    return await axios.put(usersEndpoint + 'changepassword', data, contentAuthHeaders(token));
}

export const deleteUser = async (userId) => {
    const token = getAuthToken();
    return await axios.delete(usersEndpoint + userId, contentAuthHeaders(token));
}

export const fetchUsers = async () => {
    const token = getAuthToken();
    return await axios.get(usersEndpoint, contentAuthHeaders(token));
}

export const createRecipe = async (data) => {
    const token = getAuthToken();
    return await axios.post(recipesEndpoint, data, contentAuthHeaders(token))
}

export const findRecipe = async (query) => {
    const token = getAuthToken();
    let url = recipesEndpoint;
    if (isNotEmpty(query)) {
        url += "?title=" + query;
    }
    return await axios.get(url, contentAuthHeaders(token));
}

export const updateRecipe = async (recipeId, data) => {
    const token = getAuthToken();
    return await axios.put(recipesEndpoint + recipeId, data, contentAuthHeaders(token));
}

export const deleteRecipe = async (recipeId) => {
    const token = getAuthToken();
    return await axios.delete(recipesEndpoint + recipeId, contentAuthHeaders(token));
}

export const fetchRecipes = async (page, query, limit) => {
    const token = getAuthToken();
    let url = recipesEndpoint + page + "/" + limit;
    if (isNotEmpty(query) && isNotEmpty(query.searchValue)) {
        url += "?" + query.searchKey + "=" + query.searchValue;
    }
    return await axios.get(url, contentAuthHeaders(token));
}

export const getCountRecipesAdded = async (userId) => {
    const query = '?added_by=' + userId;
    return await getCountRecipes(query)
}

export const getCountRecipesUpdated = async (userId) => {
    const query = '?updated_by=' + userId;
    return await getCountRecipes(query)
}

export const getCountRecipes = async (query) => {
    const token = getAuthToken();
    let countEndpoint = 'count';
    if (query) {
        countEndpoint += query;
    }
    return await axios.get(recipesEndpoint + countEndpoint, contentAuthHeaders(token));
}

const contentAuthHeaders = (token) => {
    return {
        headers: {
            "x-access-token": token
        }
    }
};

