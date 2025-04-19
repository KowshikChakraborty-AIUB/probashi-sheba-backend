import express from "express";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import { FaqController } from "./visaVerification.controller";

const router = express.Router();

// Create, Update, Get Faq
router
    .route("/")
    .get(FaqController.getFaq)
    .post(FaqController.postFaq
    )
    .patch(FaqController.updateFaq
    )
    .delete(FaqController.deleteFaq);

export const FaqRoutes = router;