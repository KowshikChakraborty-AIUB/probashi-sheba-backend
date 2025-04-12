import { log } from "console";
import { IUserInterface } from "./user.interface";
import userModel from "./user.model";

// create an Admin
const registerUserServices = async (payload: IUserInterface) => {
    const existingUser = await userModel.findOne({ user_phone: payload.user_phone });

    if (existingUser) {
        throw new Error("Phone number already registered");
    }

    const result = await userModel.create(payload);
    return result;
};

export const UserServices = {
    registerUserServices,
};  