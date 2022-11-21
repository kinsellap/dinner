import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.SECRET_KEY|| 'somecrazymadsecretkey';

export const signRequest = (data) => {
    return jwt.sign(data, SECRET_KEY, { expiresIn: 7200 },
    );
}

export const verifyToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
}