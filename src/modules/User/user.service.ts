import { log } from "console";
import { IUserInterface } from "./user.interface";
import userModel from "./user.model";
import { customAlphabet } from 'nanoid'


const sendOtpService = async (user_phone: string) => {
    const existingUser = await userModel.findOne({ user_phone });

    // if (existingUser && existingUser.user_phone_verified) {
    //     throw new Error("Phone number already registered");
    // }
    const nanoid = customAlphabet('1234567890abcdef', 5)
    const otp_code = nanoid()
    const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    if (existingUser) {
        existingUser.otp_code = otp_code;
        existingUser.otp_expires_at = otp_expires_at;
        await existingUser.save();
        return existingUser;
    }

    const user = await userModel.create({
        user_phone,
        otp_code,
        otp_expires_at,
        user_status: 'in-active',
        login_type: 'phone',
        user_phone_verified: false,
    });

    return user;
}

// create an Admin
const registerUserServices = async (payload: IUserInterface) => {
    const existingUser = await userModel.findOne({ user_phone: payload.user_phone });

    if (existingUser) {
        throw new Error("Phone number already registered");
    }

    const result = await userModel.create(payload);
    return result;
};

// Verify OTP
const verifyOtpServices = async (payload: IUserInterface) => {
    const { user_phone, otp_code } = payload;
    const user = await userModel.findOne({ user_phone, otp_code });

    if (!user) {
        throw new Error("Invalid OTP or phone number");
    }
    if (user.otp_expires_at && user.otp_expires_at < new Date()) {
        throw new Error("OTP expired");
    }
    // Update user status to verified and clear OTP
    user.user_phone_verified = true;
    user.otp_code = undefined;
    user.otp_expires_at = undefined;
    await user.save();
    return user;
}

// Login user with phone number and OTP
const loginServices = async (payload: IUserInterface) => {

}

export const UserServices = {
    registerUserServices,
    verifyOtpServices,
    loginServices,
    sendOtpService
};  