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

const TestimonialSchema = new mongoose.Schema(
    {
        testimonial_name: { type: String },
        testimonial_image: { type: String },
        testimonial_image_key: { type: String },
        testimonial_occupation: { type: String },
        testimonial_comment: { type: String },
        testimonial_rating: { type: Number },
    },
    { _id: false }
);

const ForMigrantWorkersTabContentsSchema = new mongoose.Schema(
    {
        for_migrant_workers_tab_contents_title: { type: String },
        for_migrant_workers_tab_contents_description: { type: String },
        for_migrant_workers_tab_contents_link: { type: String },
        for_migrant_workers_tab_contents_link_text: { type: String },
    },
    { _id: false }
);

const ForMigrantWorkersSchema = new mongoose.Schema(
    {
        for_migrant_workers_tab_name: { type: String },
        for_migrant_workers_tab_image: { type: String },
        for_migrant_workers_tab_image_key: { type: String },
        for_migrant_workers_tab_icon: { type: String },
        for_migrant_workers_tab_icon_key: { type: String },
        for_migrant_workers_tab_status: { type: String, default: 'active' },
        for_migrant_workers_tab_serial: { type: String },
        for_migrant_workers_tab_contents: [ForMigrantWorkersTabContentsSchema],
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
        testimonials: [TestimonialSchema],
        for_migrant_workers: [ForMigrantWorkersSchema],
    },
    {
        timestamps: true,
    }
);

export const WebSettingsModel = mongoose.model<IWebSettings>('webSettings', WebSettingsSchema);













































