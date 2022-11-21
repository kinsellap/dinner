import mongoose from 'mongoose';
import { RecipeSchema } from '../model/RecipeModel';
import { getUser } from './UserService';
const Recipe = mongoose.model('Recipe', RecipeSchema);

export const createRecipe = async (recipeData) => {
    let newRecipe = new Recipe(recipeData)
    return await (newRecipe.save());
}

export const getRecipe = async (recipeId) => {
    return await Recipe.findById(recipeId)
        .populate('updated_by', 'email_address')
        .populate('added_by', 'email_address');
}

export const getRecipes = async (searchQuery) => {
    let filter = {};
    if (searchQuery) {
        filter = { title: { $regex: new RegExp(searchQuery, "i") } };
    }
    return await (Recipe.find(filter)
        .populate('updated_by', 'email_address')
        .populate('added_by', 'email_address'));
}

export const getCountRecipes = async () => {
    return await (Recipe.count());
}

export const getRecipesByPage = async (page, limit, searchQuery) => {
    let filter = {};
    if (searchQuery) {
        filter = { title: { $regex: new RegExp(searchQuery, "i") } };
    }
    return await Recipe.find(filter)
        .populate('updated_by', 'email_address')
        .populate('added_by', 'email_address')
        .skip(page * limit)
        .limit(limit)
}

export const updateRecipe = async (recipeId, recipeBody) => {
    const updatedDate = new Date(Date.now());
    const updateBody = {
        ...recipeBody,
        date_updated: updatedDate
    };
    return await (Recipe.findOneAndUpdate({ _id: recipeId }, updateBody, { new: true }));
}

export const deleteRecipe = async (recipeId, userId) => {
    const user = await getUser(userId);
    if (user.admin) {
        return await (Recipe.findByIdAndDelete({ _id: recipeId }));
    }
    throw Error('Action not authorised')
}

export const deleteRecipes = async () => {
    return await (Recipe.deleteMany());
}

