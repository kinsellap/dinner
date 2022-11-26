import mongoose from 'mongoose'
import { UserSchema } from '../model/UserModel'
import bcrypt from 'bcryptjs';
const saltRounds = 10;
const lodash = require('lodash');
import { signRequest } from './AuthService';
const User = mongoose.model('User', UserSchema);

export const createUser = async (userData) => {
    const userCount = await (User.count());
    const encryptedPassword = await encryptPassword(userData.password);
    const newUser = new User({ ...userData, "password": encryptedPassword, "admin": userCount == 0 })
    const user = await (newUser.save());
    if (!user) {
        return null;
    }
    const updatedUser = await removePassword(user);
    return addTokenToUser(updatedUser)
}

export const getUserByAuth = async (userData) => {
    const { email_address, password } = userData;
    const user = await (User.findOne({ email_address }).select('+password'));
    if (!user) {
        return null;
    }
    const matchedPassword = await comparePassword(password, user.password);
    if (matchedPassword) {
        const updatedUser = await removePassword(user);
        return addTokenToUser(updatedUser)
    } else {
        throw Error('Invalid password')
    };
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

export const updateUser = async (userId, userBody, requesterId) => {
    const requester = await getUser(requesterId);
    if (requester && (requester.admin || requester._id == userId)) {
        const updatedDate = new Date(Date.now());
        const updateBody = {
            ...userBody,
            date_updated: updatedDate
        };
        return await (User.findOneAndUpdate({ _id: userId }, updateBody, { new: true }));
    }
    throw Error('Action not authorised');
}

export const deleteUser = async (userId, requesterId) => {
    const requester = await getUser(requesterId);
    if (requester && (requester.admin || requester._id == userId)) {
        return await (User.findByIdAndDelete({ _id: userId }));
    }
    throw Error('Action not authorised');
}

export const deleteUsers = async (requesterId) => {
    const requester = await getUser(requesterId);
    if (requester && requester.admin) {
        return await (User.deleteMany());
    }
    throw Error('Action not authorised');
}

const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hashSync(password, salt);
}

const comparePassword = async (password, encryptedPassword) => {
    return await bcrypt.compare(password, encryptedPassword);
}

const removePassword = async (user) => {
    return lodash.omit(user.toObject(), ['password']);
}

const addTokenToUser = (user) => {
    const { _id, email_address, password, } = user
    const token = signRequest({ _id, email_address, password });
    return { user, token };
}