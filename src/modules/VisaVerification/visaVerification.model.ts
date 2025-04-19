import mongoose from "mongoose";
import { IVisaVerification } from "./visaVerification.interface";

const VisaVerificationSchema = new mongoose.Schema<IVisaVerification>({
    visaVerification_country_name_english: { type: String },
    visaVerification_country_name_bangla: { type: String },
    visaVerification_country_image: { type: String },
    visaVerification_country_image_key: { type: String },
    visaVerification_country_link: { type: String },
})

export const VisaVerificationModel = mongoose.model<IVisaVerification>("visaVerifications", VisaVerificationSchema);