const createHttpError = require('http-errors'); // Yêu cầu: npm i http-errors
const jwt = require('jsonwebtoken'); // Yêu Cầu: npm i jsonwebtoken

/**
 *
 * 1. jwt.verify: Giải mã token jwt
 * 2. KEY: Khoá Bí Mật (Trùng với khoá khi tạo token)
 * 3. err: Khi có lỗi sẽ trả về (Token hết hạn hoặc không hợp lệ)
 * 4. decode: Khi giải mã token thành công sẽ trả về
 *
 */

const verifyToken = (token) => {
    let data = null;
    jwt.verify(token, 'KEY', (err, decode) => {
        if (!err) data = decode;
    });
    if (!data) throw createHttpError(401, 'Unauthorized: Token is invalid');
    return data;
};
