import mongoose from 'mongoose'
import { UserSchema } from '../model/UserModel'
const lodash = require('lodash');
import { signRequest, isAuthorised, isAdminAuthorised} from './AuthService';
const User = mongoose.model('User', UserSchema);

export const createUser = async (userData) => {
    const userCount = await (User.count());
    const newUser = new User({ ...userData, "password": userData.password, "admin": userCount == 0 })
    const user = await (newUser.save());
    if (!user) {
        return null;
    }
    const updatedUser = await removePassword(user);
    return addTokenToUser(updatedUser)
}

export const getUserByAuth = async (userData) => {
    const { email_address, password } = userData;
    const user = await User.findOne({ email_address }).select('+password');
    if (!user) {
        return null;
    }
    const matchedPassword = await user.verifyPasswordSync(password);
    if (matchedPassword) {
        const updatedUser = await removePassword(user);
        return addTokenToUser(updatedUser)
    } else {
        throw Error('Invalid password')
    };
}

export const changePassword = async (userData, requesterId) => {
    const { email_address, password, new_password } = userData;
    const user = await User.findOne({ email_address }).select('+password');
    if (!user) {
        return null;
    }
    const matchedPassword = await user.verifyPasswordSync(password);
    if (matchedPassword) {
        return await updateUser(user._id, {password:new_password},requesterId);
    } else {
        throw Error('Invalid password')
    };
}

export const resetPassword = async (email) => {
    let user = await User.findOne({ email_address: email })
    if (!user) {
        return null;
    }
}

export const updateUser = async (userId, userBody, requesterId) => {
    const requester = await getUser(requesterId);
    if (isAuthorised(requester, userId)) {
        const updatedDate = new Date(Date.now());
        const updateBody = {
            ...userBody,
            date_updated: updatedDate
        }
        return await User.findOneAndUpdate({ _id: userId }, updateBody, { new: true });
    }
    throw Error('Action not authorised');
}

export const deleteUser = async (userId, requesterId) => {
    const requester = await getUser(requesterId);
    if (isAuthorised(requester, userId)) {
        return await User.findByIdAndDelete({ _id: userId });
    }
    throw Error('Action not authorised');
}

export const deleteUsers = async (requesterId) => {
    const requester = await getUser(requesterId);
    if (isAdminAuthorised(requester)) {
        return await User.deleteMany();
    }
    throw Error('Action not authorised');
}

export const getUser = async (userId) => {
    return await User.findById(userId);
}

export const getUsers = async () => {
    return await User.find();
}

const removePassword = async (user) => {
    return lodash.omit(user.toObject(), ['password']);
}

const addTokenToUser = (user) => {
    const { _id, email_address, password, } = user
    const token = signRequest({ _id, email_address, password });
    return { user, token };
}


