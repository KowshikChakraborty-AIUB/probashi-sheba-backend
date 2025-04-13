import { Types } from "mongoose";
import { IAdminInterface } from "../Admin/admin.interface";

export interface IUserInterface {
    _id?: any;
    user_name?: string;
    user_phone: string;
    user_phone_verified: boolean; // ✅ indicates if OTP verification is complete
    otp_code?: string; // ✅ temporary OTP (optional, if storing in DB)
    otp_expires_at?: Date; // ✅ optional expiry for OTP
    user_address?: string;
    user_profile?: string;
    user_profile_key?: string;
    user_status: "active" | "in-active";
    user_publisher_id?: Types.ObjectId | IAdminInterface;
    user_updated_by?: Types.ObjectId | IAdminInterface;

    // ✅ Social login support
    login_type: "phone" | "google" | "facebook" | "apple";
    social_id?: string; // ✅ the ID received from social platform
    email?: string; // ✅ optional, often provided by social login
}
