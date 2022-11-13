import mongoose from 'mongoose'
import { UserSchema } from '../model/userModel'

const User = mongoose.model('User', UserSchema);

export const createUser = async (userData) => {
    let newUser = new User(userData)
    return await (newUser.save());
}

export const getUser = async (userId) => {
    return await (User.findById(userId));
}

export const getUsers = async (searchQuery) => {
    let filter = {};
    if (searchQuery) {
        filter = { name: { $regex: new RegExp(req.query.name, "i") } };
    }
    return await (User.find(filter));
}

export const updateUser = async (userId, userBody) => {
    const updatedDate = new Date(Date.now());
    const updateBody = {
        ...userBody,
        date_updated: updatedDate
    };
    return await (User.findOneAndUpdate({ _id: userId }, updateBody, { new: true }));
}

export const deleteUser = async (userId) => {
    return await (User.findByIdAndDelete({ _id: userId }));
}

