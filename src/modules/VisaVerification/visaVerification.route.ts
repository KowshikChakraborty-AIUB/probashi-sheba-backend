import express from "express";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import { VisaVerificationController } from "./visaVerification.controller";


const router = express.Router();

// Create, Update, Get Testimonial
router
    .route("/")
    .get(VisaVerificationController.getVisaVerification)
    .post(
        FileUploadHelper.ImageUpload.fields([
            { name: "visaVerification_country_image", maxCount: 1 },
        ]),
        VisaVerificationController.postVisaVerification
    )
    .patch(
        FileUploadHelper.ImageUpload.fields([
            { name: "visaVerification_country_image", maxCount: 1 },
        ]),
        VisaVerificationController.updateVisaVerification
    )
    .delete(VisaVerificationController.deleteVisaVerification);

export const VisaVerificationRoutes = router;