import { createUser, getUser, getUsers, deleteUser, updateUser } from '../service/userService';
import express from 'express';
const userRouter = express.Router();

userRouter.post('/', (req, res) => {
    createUser(req.body)
        .then(result => res.json(result))
        .catch(err => {
            res.status(400);
            res.json({ error: err.message });
        });
});

userRouter.get('/', (req, res) => {
    if (!req.query.name && Object.keys(req.query).length !== 0) {
        res.status(400);
        res.json({ error: "invalid request params" });
        return;
    }
    getUsers(req.query.name)
        .then(result => res.json(result))
        .catch(err => {
            res.status(400);
            res.json({ error: err.message });
        });
});

userRouter.get('/:id', (req, res) => {
    getUser
        .then(result => handleGetByIdResult(result, res, result))
        .catch(err => {
            res.status(404);
            res.json({ error: err.message });
        });
});

userRouter.put('/:id', (req, res) => {
    updateUser(req.params.id, req.body)
        .then(result => handleGetByIdResult(result, res, result))
        .catch(err => {
            res.status(500);
            res.json({ error: err.message });
        });
});

userRouter.delete('/:id', (req, res) => {
    deleteUser(req.params.id)
        .then(result => handleGetByIdResult(result, res, { message: `successfully deleted user` }))
        .catch(err => {
            res.status(500);
            res.json({ error: err.message });
        });
});

const handleGetByIdResult = (result, res, response) => {
    if (!result) {
        res.status(404);
        res.json({ error: "User not found" });
    } else {
        res.json(response);
    };
}

module.exports = userRouter;