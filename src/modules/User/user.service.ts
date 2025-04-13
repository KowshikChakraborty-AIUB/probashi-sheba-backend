import { log } from "console";
import { IUserInterface } from "./user.interface";
import userModel from "./user.model";
import { customAlphabet } from 'nanoid'
import { hashPassword } from "../../helpers/hashHelper";


const sendOtpService = async (user_phone: string) => {
    const existingUser = await userModel.findOne({ user_phone });

    // if (existingUser && existingUser.user_phone_verified) {
    //     throw new Error("Phone number already registered");
    // }
    const nanoid = customAlphabet('1234567890', 5)
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

    if (!existingUser || !existingUser.user_phone_verified) {
        throw new Error("Phone number not verified");
    }
    // if (existingUser.user_phone_verified) {
    //     throw new Error("Phone number already registered");
    // }
    if (existingUser.user_status === "active") {
        throw new Error("User already registered and active");
    }
    if (existingUser.user_status === "in-active") {
        existingUser.user_status = "active";
        existingUser.user_name = payload.user_name;
        existingUser.user_email = payload.user_email ?? existingUser.user_email;
        existingUser.user_password = await hashPassword(payload.user_password ?? existingUser.user_password);
        existingUser.user_phone_verified = true;
        existingUser.user_gender = payload.user_gender ?? existingUser.user_gender;
        existingUser.user_date_of_birth = payload.user_date_of_birth ?? existingUser.user_date_of_birth;
        existingUser.user_educational_qualification = payload.user_educational_qualification ?? existingUser.user_educational_qualification;
        existingUser.user_country = payload.user_country ?? existingUser.user_country;
        existingUser.user_city = payload.user_city ?? existingUser.user_city;
        existingUser.user_why_interested = payload.user_why_interested ?? existingUser.user_why_interested;
        existingUser.user_why_interested_other = payload.user_why_interested_other;
        existingUser.user_selected_countries = payload.user_selected_countries;
        existingUser.user_selected_skills = payload.user_selected_skills;
        existingUser.user_jobs = payload.user_jobs;
        existingUser.user_is_experienced = payload.user_is_experienced;
        existingUser.user_current_job = payload.user_current_job;
        existingUser.user_current_job_country = payload.user_current_job_country;
        existingUser.user_is_have_passport = payload.user_is_have_passport;
        existingUser.user_passport_number = payload.user_passport_number;
        existingUser.login_type = payload.login_type || "phone";
        existingUser.social_id = payload.social_id;
        existingUser.social_email = payload.social_email;
        existingUser.user_publisher_id = payload.user_publisher_id;
        existingUser.user_updated_by = payload.user_updated_by;

        await existingUser.save();
        return existingUser;
    }

    // await existingUser.save();

    // return existingUser;
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