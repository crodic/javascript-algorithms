const createHttpError = require('http-errors'); // Yêu cầu: npm i http-errors

const getTokenInHeader = (req, res, next) => {
    const authorization = req.headers['authorization'];
    const token = authorization?.split('Bearer ')[1];
    if (!token) return next(createHttpError(401, 'Unauthorized: Token is missing'));
};

const getTokenInCookies = (req, res, next) => {
    const { token } = req.cookies; // Yêu cầu: npm i cookie-parser
    if (!token) return next(createHttpError(401, 'Unauthorized: Token is missing'));
};
