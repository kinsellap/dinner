import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.SECRET_KEY || 'somecrazymadsecretkey';
export const UNAUTHORISED_ACTION = 'Action not authorised';

export const signRequest = (data) => {
    return jwt.sign(data, SECRET_KEY, { expiresIn: 7200 });
};

export const verifyToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
};

export function isAuthorised(requester, userId) {
    return requester && (requester.admin || requester._id == userId || requester._id.equals(userId));
};

export function isAdminAuthorised(requester) {
    return requester && requester.admin;
};