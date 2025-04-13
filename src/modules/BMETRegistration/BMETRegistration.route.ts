import express from "express";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import { getBMETRegistration, postBMETRegistration, updateBMETRegistration } from "./BMETRegistration.controller";

const router = express.Router();

// Create, Update, Get BMET
router
    .route("/")
    .get(getBMETRegistration)
    .post(
        FileUploadHelper.ImageUpload.fields([
            { name: "passport_image", maxCount: 1 },
            { name: "supporting_documents", maxCount: 10 }
        ]),
        postBMETRegistration
    )
    .patch(
        FileUploadHelper.ImageUpload.fields([
            { name: "passport_image", maxCount: 1 },
            { name: "supporting_documents", maxCount: 10 }
        ]),
        updateBMETRegistration
    )
//   .delete(deleteACategoryInfo);

export const BMETRegistrationRoutes = router;