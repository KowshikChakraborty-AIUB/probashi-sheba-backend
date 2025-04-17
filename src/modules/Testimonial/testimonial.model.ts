import mongoose from "mongoose";
import { ITestimonial } from "./testimonial.interface";

const TestimonialSchema = new mongoose.Schema<ITestimonial>(
    {
        testimonial_name: { type: String },
        testimonial_image: { type: String },
        testimonial_image_key: { type: String },
        testimonial_occupation: { type: String },
        testimonial_comment: { type: String },
        testimonial_rating: { type: Number },
    },
    {
        timestamps: true,
    }
);

export const TestimonialModel = mongoose.model<ITestimonial>('testimonials', TestimonialSchema);

