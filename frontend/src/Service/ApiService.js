import axios from 'axios'
import { getAuthToken } from "../Service/SessionService";
const serverUrl = 'http://localhost:8080/api'
const usersEndpoint = serverUrl + '/users/'
const recipesEndpoint = serverUrl + '/recipes/'

export const createUser = async (data) => {
    return await axios.post(usersEndpoint, data);
}

export const getUser = async (query) => {
    let url = usersEndpoint;
    if (isNotEmpty(query)) {
        url += "?name=" + query;
    }
    return await axios.get(url, contentAuthHeaders);
}

export const loginUser = async (credentials) => {
    return await axios.post(usersEndpoint + "login", credentials);
}

export const updateUser = async (userId, data) => {
    return await axios.put(usersEndpoint + userId, data, contentAuthHeaders);
}

export const deleteUser = async (userId) => {
    return await axios.delete(usersEndpoint + userId, contentAuthHeaders);
}

export const fetchUsers = async () => {
    return await axios.get(usersEndpoint, contentAuthHeaders);
}

export const createRecipe = async (data) => {
    return await axios.post(recipesEndpoint, data, contentAuthHeaders)
}

export const findRecipe = async (query) => {
    let url = recipesEndpoint;
    if (isNotEmpty(query)) {
        url += "?title=" + query;
    }
    return await axios.get(url, contentAuthHeaders);
}

export const updateRecipe = async (recipeId, data) => {
    return await axios.put(recipesEndpoint + recipeId, data, contentAuthHeaders);
}

export const deleteRecipe = async (recipeId) => {
    return await axios.delete(recipesEndpoint + recipeId, contentAuthHeaders);
}

export const fetchRecipes = async (page, query, limit) => {
    let url = recipesEndpoint + page + "/" + limit;
    if (isNotEmpty(query)) {
        url += "?title=" + query;
    }
    return await axios.get(url, contentAuthHeaders);
}

export const countRecipes = async () => {
    return await axios.get(recipesEndpoint + '/count', contentAuthHeaders);
}

const isNotEmpty = (query) => query !== undefined && query !== "" && query !== null;

const contentAuthHeaders = {
    headers: {
        "x-access-token": getAuthToken(),
        "content-type": "application/json",
        "accept": "application/json"
    }
};

const registerLoginHeaders = {
    headers: {
        "content-type": "application-x-www-form-urlencoded",
        "accept": "application/json"
    }
};
