import axios from "axios";
import { getAuthToken } from "../Service/SessionService";
import { isNotEmpty } from "../Utils/StringUtils";
const SERVER_URL = "http://localhost:8080/api";
const USERS_ENDPOINT = SERVER_URL + "/users/";
const RECIPES_ENDPOINT = SERVER_URL + "/recipes/";

export const createUser = async (data) => {
    return await axios.post(USERS_ENDPOINT, data);
}

export const getUser = async (query) => {
    const token = getAuthToken();
    let url = USERS_ENDPOINT;
    if (isNotEmpty(query)) {
        url += "?name=" + query;
    }
    return await axios.get(url, contentAuthHeaders(token));
}

export const loginUser = async (credentials) => {
    return await axios.post(USERS_ENDPOINT + "login", credentials);
}

export const updateUser = async (userId, data) => {
    const token = getAuthToken();
    return await axios.put(USERS_ENDPOINT + userId, data, contentAuthHeaders(token));
}

export const changePassword = async (data) => {
    const token = getAuthToken();
    return await axios.put(USERS_ENDPOINT + "changepassword", data, contentAuthHeaders(token));
}

export const deleteUser = async (userId) => {
    const token = getAuthToken();
    return await axios.delete(USERS_ENDPOINT + userId, contentAuthHeaders(token));
}

export const fetchUsers = async () => {
    const token = getAuthToken();
    return await axios.get(USERS_ENDPOINT, contentAuthHeaders(token));
}

export const createRecipe = async (data) => {
    const token = getAuthToken();
    return await axios.post(RECIPES_ENDPOINT, data, contentAuthHeaders(token))
}

export const findRecipe = async (query) => {
    const token = getAuthToken();
    let url = RECIPES_ENDPOINT;
    if (isNotEmpty(query)) {
        url += "?title=" + query;
    }
    return await axios.get(url, contentAuthHeaders(token));
}

export const updateRecipe = async (recipeId, data) => {
    const token = getAuthToken();
    return await axios.put(RECIPES_ENDPOINT + recipeId, data, contentAuthHeaders(token));
}

export const deleteRecipe = async (recipeId) => {
    const token = getAuthToken();
    return await axios.delete(RECIPES_ENDPOINT + recipeId, contentAuthHeaders(token));
}

export const fetchRecipes = async (page, query, limit) => {
    const token = getAuthToken();
    let url = RECIPES_ENDPOINT + page + "/" + limit;
    if (isNotEmpty(query) && isNotEmpty(query.value)) {
        url += "?" + query.key + "=" + query.value;
    }
    return await axios.get(url, contentAuthHeaders(token));
}

export const getCountRecipesAdded = async (userId) => {
    const query = "?added_by=" + userId;
    return await getCountRecipes(query)
}

export const getCountRecipesUpdated = async (userId) => {
    const query = "?updated_by=" + userId;
    return await getCountRecipes(query)
}

export const getCountRecipes = async (query) => {
    const token = getAuthToken();
    let countEndpoint = "count";
    if (query) {
        countEndpoint += query;
    }
    return await axios.get(RECIPES_ENDPOINT + countEndpoint, contentAuthHeaders(token));
}

const contentAuthHeaders = (token) => {
    return {
        headers: {
            "x-access-token": token
        }
    }
};

