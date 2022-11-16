import { createUser, getUser, getUsers, deleteUser,deleteUsers, updateUser,getUserByAuth } from '../service/UserService';
import express from 'express';

const userRouter = express.Router();

userRouter.post('/',async(req, res) => {
    createUser(req.body)
        .then(result => res.json(result))
        .catch(err => {
            res.status(400);
            if(err.message.includes(" email_address_1 dup key")){
                 res.json({ message: "email address is already in use" });
            } else {
            res.json({ message: err.message });
            }
        });
});

userRouter.get('/', async(req, res) => {
    if (!req.query.name && Object.keys(req.query).length !== 0) {
        res.status(400);
        res.json({ message: "invalid request params" });
        return;
    }
    getUsers(req.query.name)
        .then(result => res.json(result))
        .catch(err => {
            res.status(400);
            res.json({ message: err.message });
        });
});

userRouter.post('/login', async(req, res) => {
    getUserByAuth(req.body)
        .then(result => handleGetUserResult(result, res, result))
        .catch(err => {
            res.status(400);
            res.json({ message: err.message });
        });
});

userRouter.get('/:id', async(req, res) => {
    getUser(req.params.id)
        .then(result => handleGetUserResult(result, res, result))
        .catch(err => {
            res.status(404);
            res.json({ message: err.message });
        });
});

userRouter.put('/:id', async(req, res) => {
    updateUser(req.params.id, req.body)
        .then(result => handleGetUserResult(result, res, result))
        .catch(err => {
            res.status(500);
            res.json({ message: err.message });
        });
});

userRouter.delete('/:id', async(req, res) => {
    deleteUser(req.params.id)
        .then(result => handleGetUserResult(result, res, { message: `successfully deleted user` }))
        .catch(err => {
            res.status(500);
            res.json({ message: err.message });
        });
});

userRouter.delete('/', (req, res) => {
    deleteUsers()
        .then(() => res.json({ message: `successfully deleted all users` }))
        .catch(err => {
            res.status(500);
            res.json({ message: err.message });
        });
});

const handleGetUserResult = (result, res, response) => {
    if (!result) {
        res.status(404);
        res.json({ message: "User not found" });
    } else {
        res.json(response);
    };
}

module.exports = userRouter;