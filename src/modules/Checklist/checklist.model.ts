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
        checklist_isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const ChecklistModel = mongoose.model<IChecklist>('checklists', ChecklistSchema);

