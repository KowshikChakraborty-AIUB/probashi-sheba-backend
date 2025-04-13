import { Types } from "mongoose";
import { IAdminInterface } from "../Admin/admin.interface";

export interface IUserInterface {
    _id?: any;
    user_name?: string;
    user_email?: string;
    user_phone: string;
    user_password?: string;
    user_phone_is_verified: boolean; 
    user_email_is_verified: boolean; 
    otp_code?: number; // ✅ temporary OTP (optional, if storing in DB)
    otp_expires_at?: Date; // ✅ optional expiry for OTP
    user_address?: string;
    user_gender?: string;
    user_date_of_birth?: string; // ✅ date of birth
    user_educational_qualification?: string; // ✅ educational qualification
    user_country?: string; // ✅ country of residence
    user_city?: string; // ✅ city of residence
    user_why_interested?: "government_service" | "job" | "training" | "other";
    user_why_interested_other?: string; // ✅ optional, if "other" is selected
    user_selected_countries: string[]; // ✅ array of selected countries
    user_selected_skills: string[]; // ✅ array of selected skills
    user_jobs: string[]; // ✅ array of selected jobs
    user_is_experienced: boolean;
    user_current_job?: string; // ✅ optional, current job title or position
    user_current_job_country?: string; // ✅ optional, current job country
    user_is_have_passport?: boolean; // ✅ optional, indicates if the user has a passport
    user_passport_number?: string; // ✅ optional, passport number

    user_profile?: string;
    user_profile_key?: string;
    user_status: "active" | "in-active";
    user_publisher_id?: Types.ObjectId | IAdminInterface;
    user_updated_by?: Types.ObjectId | IAdminInterface;

    // ✅ Social login support
    login_type: "phone" | "google" | "facebook" | "apple";
    social_id?: string; // ✅ the ID received from social platform
    social_email?: string; // ✅ optional, often provided by social login
}
