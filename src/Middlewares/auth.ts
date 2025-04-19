import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/User/user.interface';
import catchAsync from '../utils/catchAsync';
import userModel from '../modules/User/user.model';


export const auth = (...requiredRole: TUserRole[]) => {

    return catchAsync(async (req, res, next) => {
        // const token = req.headers.authorization;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                success: false,
                statusCode: 401,
                message: 'You have no access to this route',
            });
        }

        const decoded = jwt.verify(
            token,
            config.jwt_access_secret as string,
        ) as JwtPayload;

        const { role, user_email, user_phone } = decoded;

        const userData = await userModel.findOne({ user_email, user_phone });


        if (!userData) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                success: false,
                statusCode: 401,
                message: 'You have no access to this route',
            });
        }
        console.log(requiredRole, 'requiredRole');
        console.log(role, 'role');
        console.log(requiredRole.includes(role), 'requiredRole.includes(role)');
        if (requiredRole && !requiredRole.includes(role)) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                success: false,
                statusCode: 401,
                message: 'You have no access to this route',
            });
        }

        req.user = decoded as JwtPayload;
        next();
    });
};