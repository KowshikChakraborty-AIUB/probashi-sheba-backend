import jwt from 'jsonwebtoken';

export const createToken = (
    jwtPayload: { _id: string; user_phone?: string; user_email?:string; },
    secret: string,
    expiresIn: string | number,
) => {
    return jwt.sign(jwtPayload, secret, {
        expiresIn: expiresIn as string | number,
      });
       
};

