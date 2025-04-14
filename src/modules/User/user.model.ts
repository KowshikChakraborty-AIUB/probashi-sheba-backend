import mongoose, { Schema, Document } from "mongoose";
import { IAdminInterface } from "../Admin/admin.interface";


export interface IUserDocument extends Document {
    user_name?: string;
    user_email: string;
    user_phone: string;
    user_password: string;
    user_phone_is_verified: boolean;
    user_email_is_verified: boolean;
    otp_code?: number;
    otp_expires_at?: Date;
    user_address?: string;
    user_gender: string;
    user_date_of_birth: string; // ✅ date of birth
    user_educational_qualification: string; // ✅ educational qualification
    user_country: string; // ✅ country of residence
    user_city: string; // ✅ city of residence
    user_why_interested: "government_service" | "job" | "training" | "other";
    user_why_interested_other?: string; // ✅ optional, if "other" is selected
    user_selected_countries: string[]; // ✅ array of selected countries
    user_selected_skills: string[]; // ✅ array of selected skills
    user_jobs: string[];
    user_is_experienced: boolean; // ✅ optional, indicates if the user is experienced
    user_current_job?: string; // ✅ optional, current job title or position
    user_current_job_country?: string; // ✅ optional, current job country
    user_is_have_passport?: boolean; // ✅ optional, indicates if the user has a passport
    user_passport_number?: string; // ✅ optional, passport number
    user_profile?: string;
    user_profile_key?: string;
    user_status: "active" | "in-active";
    user_publisher_id?: mongoose.Types.ObjectId | IAdminInterface;
    user_updated_by?: mongoose.Types.ObjectId | IAdminInterface;

    // login_type: "phone" | "email" | "social";
    social_id?: string;
    social_email?: string;
}

const UserSchema: Schema = new Schema<IUserDocument>(
    {
        user_name: { type: String },
        user_email: { type: String },
        user_phone: { type: String, unique: true },
        user_password: { type: String },
        user_phone_is_verified: { type: Boolean, default: false },
        user_email_is_verified: { type: Boolean, default: false },

        otp_code: { type: Number }, // optional, hash if stored
        otp_expires_at: { type: Date },

        user_address: { type: String },
        user_gender: { type: String },
        user_date_of_birth: { type: String }, // date of birth
        user_educational_qualification: { type: String }, // educational qualification
        user_country: { type: String }, // country of residence
        user_city: { type: String }, // city of residence
        user_why_interested: {
            type: String,
            enum: ["government_service", "job", "training", "other"],
        },
        user_why_interested_other: { type: String }, // optional, if "other" is selected
        user_selected_countries: [{ type: String }], // array of selected countries
        user_selected_skills: [{ type: String }], // array of selected skills
        user_jobs: [{ type: String }], // array of selected jobs
        user_is_experienced: { type: Boolean, default: false }, // optional, indicates if the user is experienced
        user_current_job: { type: String }, // optional, current job title or position
        user_current_job_country: { type: String }, // optional, current job country
        user_is_have_passport: { type: Boolean, default: false }, // optional, indicates if the user has a passport
        user_passport_number: { type: String }, // optional, passport number

        user_profile: { type: String },
        user_profile_key: { type: String },
        user_status: {
            type: String,
            enum: ["active", "in-active"],
            default: "active",
        },

        user_publisher_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "admins",
        },
        user_updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "admins",
        },

        // login_type: {
        //     type: String,
        //     enum: ["phone", "email", "social"],
        //     default: "phone",
        // },
        social_id: { type: String },
        social_email: { type: String },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IUserDocument>("users", UserSchema);
