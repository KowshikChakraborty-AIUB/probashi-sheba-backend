import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import catchAsync from "../Utils/catchAsync";


const validateRequest = (schema: AnyZodObject) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            //validation check
            //if everything alright, go to next();
            await schema.parseAsync({
                body: req.body,
            })


            next();
        }
    )
}

export default validateRequest;