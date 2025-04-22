import mongoose from 'mongoose';
import { IWebSettings } from './webSettings.interface';


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
        privacy_policy: { type: String },
        terms: { type: String }
    },
    {
        timestamps: true,
    }
);

export const WebSettingsModel = mongoose.model<IWebSettings>('webSettings', WebSettingsSchema);













































