import mongoose from "mongoose";
import { IMyDocument } from "./myDocument.interface";


const MyDocumentSchema = new mongoose.Schema<IMyDocument>(
    {
        document_name: {
            type: String,
            required: true,
            trim: true,
        },
        document_image: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

export const MyDocumentModel = mongoose.model<IMyDocument>('myDocuments', MyDocumentSchema);

