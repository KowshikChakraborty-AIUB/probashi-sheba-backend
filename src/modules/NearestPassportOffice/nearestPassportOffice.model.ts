import { Schema, model } from "mongoose";
import { INearestPassportOffice } from "./nearestPassportOffice.interface";

const nearestPassportSchema = new Schema<INearestPassportOffice>(
    {
        nearest_passport_address: {type: String, required: true},
        nearest_passport_detailed_address: {type: String, required: true},
        nearest_passport_website_link: {type: String, required: true},
        nearest_passport_phone: {type: Number, required: true},
        nearest_passport_email: {type: String, required: true},
    },
    {
        timestamps: true,
    }
);

const nearestPassportOfficeModel = model<INearestPassportOffice>("nearestpassportoffices", nearestPassportSchema);

export default nearestPassportOfficeModel;