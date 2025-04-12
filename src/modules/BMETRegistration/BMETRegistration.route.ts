import express from "express";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import { postBMETRegistration } from "./BMETRegistration.controller";

const router = express.Router();

// Create, Update, Get BMET
router
    .route("/")
    //   .get(findAllCategory)
    .post(
        FileUploadHelper.ImageUpload.fields([
            { name: "passport_image", maxCount: 1 },
            { name: "supporting_documents", maxCount: 10 }
        ]),
        postBMETRegistration
    )
//   .patch(
//     FileUploadHelper.ImageUpload.fields([
//       { name: "category_logo", maxCount: 1 },
//     ]),
//     updateCategory
//   )
//   .delete(deleteACategoryInfo);

export const BMETRegistrationRoutes = router;