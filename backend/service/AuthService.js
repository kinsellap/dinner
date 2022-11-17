import jwt from 'jsonwebtoken';
const KEY = 'somecrazymadsecretkey'
var crypto = require("crypto");

export const signRequest = (data) => {
    var random = crypto.randomBytes(20).toString('hex');
    return jwt.sign(data, "somecrazymadsecretkey",
        {
            algorithm: "HS256",
            expiresIn: 1800
        });
}

export const verifyToken = (token) => {
    return jwt.verify(token, "somecrazymadsecretkey");
}