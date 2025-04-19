import mongoose from "mongoose";
import { IFaq } from "./faq.interface";

const FaqSchema = new mongoose.Schema<IFaq>({
    faq_question_english: { type: String },
    faq_question_bangla: { type: String },
    faq_answer_english: { type: String },
    faq_answer_bangla: { type: String },
    faq_category: { type: String },
})

export const FaqModel = mongoose.model<IFaq>("faqs", FaqSchema);