import JWT from 'jsonwebtoken';

const generateToken = async (payload, secretKey, expiresIn) => {
    try {
        return JWT.sign(payload, secretKey, { algorithm: 'HS256', expiresIn });
    } catch (error) {
        throw new Error(error);
    }
};

const verifyToken = async (token, secretKey) => {
    try {
        return JWT.verify(token, secretKey, { algorithms: 'HS256' });
    } catch (error) {
        throw new Error(error);
    }
};

export const JwtProvider = { generateToken, verifyToken };
