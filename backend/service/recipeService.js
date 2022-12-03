import mongoose from 'mongoose';
import { RecipeSchema } from '../model/RecipeModel';
import { getUserInternal } from './UserService';
import { isAdminAuthorised, UNAUTHORISED_ACTION } from './AuthService';
const Recipe = mongoose.model('Recipe', RecipeSchema);

export const createRecipe = async (recipeBody) => {
    const { added_by } = recipeBody
    const user = await getUserInternal(added_by._id);
    if (user) {
        let newRecipe = new Recipe(recipeBody)
        return await (newRecipe.save());
    }
    throw Error(UNAUTHORISED_ACTION);
}

export const getRecipe = async (recipeId) => {
    return await Recipe.findById(recipeId)
        .populate('updated_by', 'email_address')
        .populate('added_by', 'email_address');
}

export const getCountRecipes = async (query) => {
    const { added_by, updated_by } = query;
    if (Object.keys(query).length && !added_by && !updated_by) {
        throw Error('Query not supported');
    }
    return await (Recipe.count(query));
}

export const getRecipesByPage = async (page, limit, searchQuery) => {
    let filter = searchQuery;
    if (Object.keys(searchQuery).length && isRegexSearchKey(searchQuery)) {
        const key = Object.keys(searchQuery)[0];
        const values = Object.values(searchQuery)[0];
        filter[key] = { $regex: new RegExp(values, "i") }
    } else if (searchQuery.id) {
        const objectIds = convertStringIdToObject(filter.id);
        filter = { _id: { $in: objectIds } }
    }
    return await Recipe.find(filter)
        .populate('updated_by', 'email_address')
        .populate('added_by', 'email_address')
        .skip(page * limit)
        .limit(limit)
}


export const updateRecipe = async (recipeId, recipeBody) => {
    const { updated_by } = recipeBody;
    const user = await getUserInternal(updated_by._id);
    if (user) {
        const updatedDate = new Date(Date.now());
        const updateBody = {
            ...recipeBody,
            date_updated: updatedDate
        };
        return await (Recipe.findOneAndUpdate({ _id: recipeId }, updateBody, { new: true }));
    }
    throw Error(UNAUTHORISED_ACTION);
}

export const deleteRecipe = async (recipeId, userId) => {
    const user = await getUserInternal(userId);
    if (isAdminAuthorised(user)) {
        return await (Recipe.findByIdAndDelete({ _id: recipeId }));
    }
    throw Error(UNAUTHORISED_ACTION);
}

export const deleteRecipes = async (userId) => {
    const user = await getUserInternal(userId);
    if (isAdminAuthorised(user)) {
        return await Recipe.deleteMany();
    }
    throw Error(UNAUTHORISED_ACTION);
}

const isRegexSearchKey = (searchQuery) => {
    return (searchQuery.title || searchQuery.core_ingredient
        || searchQuery.prep_time || searchQuery.cook_time);
}

const convertStringIdToObject = (ids) => {
    return ids.split(',').map((element) => {
        return mongoose.Types.ObjectId(element);
    })
}