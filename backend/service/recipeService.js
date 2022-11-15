import mongoose from 'mongoose';
import { RecipeSchema } from '../model/recipeModel';
const Recipe = mongoose.model('Recipe', RecipeSchema);

export const createRecipe = async (recipeData) => {
    let newRecipe = new Recipe(recipeData)
    return await (newRecipe.save());
}

export const getRecipe = async (recipeId) => {
    return await (Recipe.findById(recipeId));
}

export const getRecipes = async (searchQuery) => {
    let filter = {};
    if (searchQuery) {
        filter = { title: { $regex: new RegExp(searchQuery, "i") } };
    }
    return await (Recipe.find(filter));
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
        .skip(page * limit)
        .limit(limit);
}

export const updateRecipe = async (recipeId, recipeBody) => {
    const updatedDate = new Date(Date.now());
    const updateBody = {
        ...recipeBody,
        date_updated: updatedDate
    };
    return await (Recipe.findOneAndUpdate({ _id: recipeId }, updateBody, { new: true }));
}

export const deleteRecipe = async (recipeId) => {
    return await (Recipe.findByIdAndDelete({ _id: recipeId }));
}

export const deleteRecipes = async () => {
    return await (Recipe.deleteMany());
}

