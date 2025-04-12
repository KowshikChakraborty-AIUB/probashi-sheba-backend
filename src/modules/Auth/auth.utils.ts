import jwt from 'jsonwebtoken';
import { Types } from "mongoose";

type TTokenUserData = {
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
    address: string;
    profileImg?: string;
    verified?: boolean;
    payment: boolean;
    admin_status: "active" | "in-active";
};

export const createToken = (
    jwtPayload: TTokenUserData,
    secret: string,
    expiresIn: string,
) => {
    return jwt.sign(jwtPayload, secret, {
        expiresIn,
    });
};