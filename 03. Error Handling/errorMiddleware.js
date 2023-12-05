const createHttpError = require('http-errors'); // Yêu cầu: npm i http-errors

/**
 *
 * 1. errorHandler: Hàm nhận error xử lý và trả về lỗi đã được custom
 * 2. NotFoundApi: Hàm sẽ thực thi khi api không được tìm thấy
 * 3. next(error): Điều hướng lỗi vào hàm errorHandler
 * 4. Hàm errorHandler và NotFoundApi sẽ đặt ở cuối các route với NotFoundApi đứng trước errorHandler
 *
 */

const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const messageError = err.message || 'Internal Server Error';
    const stack = err.stack || null;
    const customError = {
        status: statusCode,
        message: messageError,
        stack: stack,
    };
    if (process.env.ENV == 'production') delete customError.stack;
    return res.status(statusCode).json(customError);
};

const NotFoundApi = (req, res, next) => {
    const error = createHttpError(404, 'API not found !!!');
    next(error);
};

// Sử dụng trong file server.js hoặc index.js
const app = require('express')();

app.use('*', NotFoundApi);
app.use(errorHandler);
