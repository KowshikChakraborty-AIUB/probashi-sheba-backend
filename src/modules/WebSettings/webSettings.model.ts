import mongoose from 'mongoose';
import { IWebSettings } from './webSettings.interface';


const WhoWeAreItemSchema = new mongoose.Schema(
    {
        image: { type: String },
        image_key: { type: String },
        unit: { type: Number },
        title: { type: String },
    },
    { _id: false }
);

const WhoWeAreSchema = new mongoose.Schema(
    {
        who_we_are_title: { type: String },
        who_we_are_description: { type: String },
        who_we_are_services: WhoWeAreItemSchema,
        who_we_are_migrants: WhoWeAreItemSchema,
        who_we_are_saved: WhoWeAreItemSchema,
        who_we_are_days: WhoWeAreItemSchema,
        who_we_are_employees: WhoWeAreItemSchema,
    },
    { _id: false }
);


const WebSettingsSchema = new mongoose.Schema<IWebSettings>(
    {
        title: { type: String },
        favicon: { type: String },
        favicon_key: { type: String },
        logo: { type: String },
        logo_key: { type: String },
        phone: { type: String },
        email: { type: String },
        address: { type: String },
        facebook_link: { type: String },
        instagram_link: { type: String },
        twitter_link: { type: String },
        youtube_link: { type: String },
        whatsapp_link: { type: String },
        welcome_message: { type: String },
        about: { type: String },
        privacy_policy: { type: String },
        terms: { type: String },
        who_we_are: WhoWeAreSchema,
    },
    {
        timestamps: true,
    }
);

export const WebSettingsModel = mongoose.model<IWebSettings>('webSettings', WebSettingsSchema);













































