import express from "express";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import { MyDocumentController } from "./myDocument.controller";

const router = express.Router();

// Create, Update, Get Testimonial
router
    .route("/")
    .get(MyDocumentController.getMyDocument)
    .post(
        FileUploadHelper.ImageUpload.fields([
            { name: "document_image", maxCount: 1 },
        ]),
        MyDocumentController.postMyDocument
    )
    .patch(
        FileUploadHelper.ImageUpload.fields([
            { name: "document_image", maxCount: 1 },
        ]),
        MyDocumentController.updateMyDocument
    )
    .delete(MyDocumentController.deleteMyDocument);

export const TestimonialRoutes = router;