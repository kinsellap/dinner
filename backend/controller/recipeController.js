import { createRecipe, getRecipes, getRecipesByPage,getRecipe, updateRecipe, deleteRecipe, deleteRecipes,getCountRecipes } from '../service/RecipeService';
import express from 'express';
import verify from '../middleware/Auth';
const recipeRouter = express.Router();

recipeRouter.post('/',verify, (req, res) => {
    createRecipe(req.body)
        .then(result => res.json(result))
        .catch(err => {
            res.status(400);
            res.json({ message: err.message });
        });
});

recipeRouter.get('/',verify, (req, res) => {
    if (!req.query.title && Object.keys(req.query).length !== 0) {
        res.status(400);
        res.json({ message: "invalid request params" });
        return;
    }
    getRecipes(req.query.title)
        .then(result => res.json(result))
        .catch(err => {
            res.status(400);
            res.json({ message: err.message });
        });
});

recipeRouter.get('/count',verify, (req, res) => {
    getCountRecipes()
        .then(result => res.json(result))
        .catch(err => {
            res.status(400);
            res.json({ message: err.message });
        });
});


recipeRouter.get('/:page/:limit',verify, (req, res) => {
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    const searchQuery = req.query.title
    getRecipesByPage(page, limit,searchQuery)
        .then(result => res.json(result))
        .catch(err => {
            res.status(400);
            res.json({ message: err.message });
        });
});

recipeRouter.get('/:id',verify, (req, res) => {
    getRecipe(req.params.id)
        .then(result => handleGetByIdResult(result, res, result))
        .catch(err => {
            res.status(404);
            res.json({ message: err.message });
        });
});

recipeRouter.put('/:id',verify, (req, res) => {
    updateRecipe(req.params.id, req.body)
        .then(result => handleGetByIdResult(result, res, result))
        .catch(err => {
            res.status(500);
            res.json({ message: err.message });
        });
});

recipeRouter.delete('/:id',verify, (req, res) => {
    deleteRecipe(req.params.id)
        .then(result => handleGetByIdResult(result, res, { message: `successfully deleted recipe` }))
        .catch(err => {
            res.status(500);
            res.json({ message: err.message });
        });
});

recipeRouter.delete('/',verify, (req, res) => {
    deleteRecipes()
        .then(() => res.json({ message: `successfully deleted all recipes` }))
        .catch(err => {
            res.status(500);
            res.json({ message: err.message });
        });
});

const handleGetByIdResult = (result, res, response) => {
    if (!result) {
        res.status(404);
        res.json({ message: "Recipe not found" });
    } else {
        res.json(response);
    };
}

module.exports = recipeRouter;


