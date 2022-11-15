import axios from 'axios'
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
    return await axios.get(url);
}

export const login = async (data) => {
    return await axios.post(usersEndpoint + "login",data);
}

export const updateUser = async (userId, data) => {
    return await axios.put(usersEndpoint + userId, data);
}

export const deleteUser = async (userId) => {
    return await axios.delete(usersEndpoint + userId);
}

export const fetchUsers = async () => {
    return await axios.get(usersEndpoint);
}

export const createRecipe = async (data) => {
    return await axios.post(recipesEndpoint, data)
}

export const findRecipe = async (query) => {
    let url = recipesEndpoint;
    if (isNotEmpty(query)) {
        url += "?title=" + query;
    }
    return await axios.get(url);
}

export const updateRecipe = async (recipeId, data) => {
    return await axios.put(recipesEndpoint + recipeId, data);
}

export const deleteRecipe = async (recipeId) => {
    return await axios.delete(recipesEndpoint + recipeId);
}

export const fetchRecipes = async (page, query, limit) => {
    let url = recipesEndpoint + page + "/" + limit;
    if (isNotEmpty(query)) {
        url += "?title=" + query;
    }
    return await axios.get(url);
}

export const countRecipes = async () => {
    return await axios.get(recipesEndpoint + '/count');
}

const isNotEmpty = (query) => query !== undefined && query !== "" && query !== null;

export const getErrorDetails = (err) => {
    if (err.response?.data?.message) {
        return " - " + err.response.data.message;
    }
}