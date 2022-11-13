import { createRecipe, getRecipes, getRecipesByPage,getRecipe, updateRecipe, deleteRecipe, deleteRecipes } from '../service/recipeService';
import express from 'express';
const recipeRouter = express.Router();

recipeRouter.post('/', (req, res) => {
    createRecipe(req.body)
        .then(result => res.json(result))
        .catch(err => {
            res.status(400);
            res.json({ error: err.message });
        });
});

recipeRouter.get('/', (req, res) => {
    if (!req.query.title && Object.keys(req.query).length !== 0) {
        res.status(400);
        res.json({ error: "invalid request params" });
        return;
    }
    getRecipes(req.query.title)
        .then(result => res.json(result))
        .catch(err => {
            res.status(400);
            res.json({ error: err.message });
        });
});

recipeRouter.get('/:page/:limit', (req, res) => {
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    const searchQuery = req.query.title
    getRecipesByPage(page, limit,searchQuery)
        .then(result => res.json(result))
        .catch(err => {
            res.status(400);
            res.json({ error: err.message });
        });
});

recipeRouter.get('/:id', (req, res) => {
    getRecipe(req.params.id)
        .then(result => handleGetByIdResult(result, res, result))
        .catch(err => {
            res.status(404);
            res.json({ error: err.message });
        });
});

recipeRouter.put('/:id', (req, res) => {
    updateRecipe(req.params.id, req.body)
        .then(result => handleGetByIdResult(result, res, result))
        .catch(err => {
            res.status(500);
            res.json({ error: err.message });
        });
});

recipeRouter.delete('/:id', (req, res) => {
    deleteRecipe(req.params.id)
        .then(result => handleGetByIdResult(result, res, { message: `successfully deleted recipe` }))
        .catch(err => {
            res.status(500);
            res.json({ error: err.message });
        });
});

recipeRouter.delete('/', (req, res) => {
    deleteRecipes()
        .then(() => res.json({ message: `successfully deleted all recipes` }))
        .catch(err => {
            res.status(500);
            res.json({ error: err.message });
        });
});

const handleGetByIdResult = (result, res, response) => {
    if (!result) {
        res.status(404);
        res.json({ error: "Recipe not found" });
    } else {
        res.json(response);
    };
}

module.exports = recipeRouter;

