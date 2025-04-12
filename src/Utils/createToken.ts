import jwt from 'jsonwebtoken';

export const createToken = (
    jwtPayload: { admin_phone: string; admin_status: string },
    secret: string,
    expiresIn: string,
) => {
    return jwt.sign(jwtPayload, secret, {
        expiresIn,
    });
};