import { Types } from "mongoose";

export interface IPdo {
    pdo_country: string;
    pdo_training_center: string; // ObjectID??
    pdo_booking_date: string;
    pdo_booking_time: string;
    bmet_id: Types.ObjectId;
}