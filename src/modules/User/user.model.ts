import mongoose, { Schema, Document } from "mongoose";
import { IAdminInterface } from "../Admin/admin.interface";


export interface IUserDocument extends Document {
    user_name: string;
    user_phone: string;
    user_phone_verified: boolean;
    otp_code?: string;
    otp_expires_at?: Date;
    user_address?: string;
    user_profile?: string;
    user_profile_key?: string;
    user_status: "active" | "in-active";
    user_publisher_id?: mongoose.Types.ObjectId | IAdminInterface;
    user_updated_by?: mongoose.Types.ObjectId | IAdminInterface;

    login_type: "phone" | "google" | "facebook" | "apple";
    social_id?: string;
    email?: string;
}

const UserSchema: Schema = new Schema<IUserDocument>(
    {
        user_name: { type: String},
        user_phone: { type: String, required: true, unique: true },
        user_phone_verified: { type: Boolean, default: false },

        otp_code: { type: String }, // optional, hash if stored
        otp_expires_at: { type: Date },

        user_address: { type: String },
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

        login_type: {
            type: String,
            enum: ["phone", "google", "facebook", "apple"],
            default: "phone",
        },
        social_id: { type: String },
        email: { type: String },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IUserDocument>("users", UserSchema);
