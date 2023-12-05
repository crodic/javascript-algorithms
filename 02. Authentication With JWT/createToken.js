const jwt = require('jsonwebtoken'); // Yêu Cầu: npm i jsonwebtoken

const createToken = (data) => {
    // 1. jwt.sign: Đăng Ký 1 JWT
    // 2. KEY: "Khoá Bí Mật Để Mã Hoá data"
    // 3. expiresIn: Thời gian tồn tại (ms)
    return jwt.sign(data, 'KEY', { expiresIn: 1 * 60 * 1000 });
};
