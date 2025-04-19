import mongoose from "mongoose";
import { IChecklist } from "./checklist.interface";

const ChecklistSchema = new mongoose.Schema<IChecklist>(
    {
        checklist_title: {
            type: String,
            required: true,
            trim: true,
        },
        checklist_description: {
            type: String,
            default: '',
            trim: true,
        },
        checklist_status: {
            type: String,
            enum: ['next', 'completed', 'upcoming'],
            default: 'next',
        },
        checklist_index_group: {
            type: Number,
            required: true,
        },
        checklist_origin: {
            type: String,
            // enum: ['next', 'upcoming'],
            default: 'next',
        },
    },
    {
        timestamps: true,
    }
);

export const ChecklistModel = mongoose.model<IChecklist>('checklists', ChecklistSchema);

