import mongoose from "mongoose";
import { IPdo } from "./pdo.interface";

const PdoSchema = new mongoose.Schema<IPdo>(
    {
        pdo_country: {
            type: String,
            required: true,
            trim: true,
        },
        pdo_training_center: {
            type: String,
        },
        pdo_booking_date: {
            type: String
        },
        pdo_booking_time: {
            type: String
        },
        bmet_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'bmetregistrations'
        },
    },
    {
        timestamps: true,
    }
);

export const PdoModel = mongoose.model<IPdo>('pdos', PdoSchema);

