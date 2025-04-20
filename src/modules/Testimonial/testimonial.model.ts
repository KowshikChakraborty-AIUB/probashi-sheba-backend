import mongoose from "mongoose";
import { ITestimonial } from "./testimonial.interface";

const TestimonialSchema = new mongoose.Schema<ITestimonial>(
    {
        testimonial_name_english: { type: String },
        testimonial_name_bangla: { type: String },
        testimonial_image: { type: String },
        testimonial_image_key: { type: String },
        testimonial_occupation_english: { type: String },
        testimonial_occupation_bangla: { type: String },
        testimonial_comment_english: { type: String },
        testimonial_comment_bangla: { type: String },
        testimonial_status: { type: String },
        testimonial_serial: { type: Number },
        testimonial_rating: { type: Number },
    },
    {
        timestamps: true,
    }
);

export const TestimonialModel = mongoose.model<ITestimonial>('testimonials', TestimonialSchema);

