import mongoose, { Schema, Types, model } from 'mongoose';
import { IWhoWeAre } from './whoWeAre.interface';

const WhoWeAreItemSchema = new mongoose.Schema(
    {
        who_we_are_item_image: { type: String },
        who_we_are_item_image_key: { type: String },
        who_we_are_item_unit: { type: Number },
        who_we_are_item_title: { type: String },
    },
    { _id: false }
);

const WhoWeAreSchema = new Schema<IWhoWeAre>(
    {
        _id: { type: Types.ObjectId },
        who_we_are_title: { type: String },
        who_we_are_description: { type: String },
        who_we_are_services: WhoWeAreItemSchema,
        who_we_are_migrants: WhoWeAreItemSchema,
        who_we_are_saved: WhoWeAreItemSchema,
        who_we_are_days: WhoWeAreItemSchema,
        who_we_are_employees: WhoWeAreItemSchema,
    },
    {
        timestamps: true,
    }
);

export const ForMigrantWorkerModel = model<IWhoWeAre>('forMigrantWorkers', WhoWeAreSchema);
