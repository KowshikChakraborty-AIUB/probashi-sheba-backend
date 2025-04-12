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
};  