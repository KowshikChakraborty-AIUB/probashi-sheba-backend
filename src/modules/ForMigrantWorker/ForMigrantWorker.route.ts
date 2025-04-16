import express from "express";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import { ForMigrantWorkerController } from "./ForMigrantWorker.controller";

const router = express.Router();

// Create, Update, Get BMET
router
    .route("/")
    .get(ForMigrantWorkerController.getForMigrantWorker)
    .post(
        FileUploadHelper.ImageUpload.fields([
            { name: "passport_image", maxCount: 1 },
            { name: "supporting_documents", maxCount: 10 }
        ]),
        ForMigrantWorkerController.postForMigrantWorker
    )
    .patch(
        FileUploadHelper.ImageUpload.fields([
            { name: "passport_image", maxCount: 1 },
            { name: "supporting_documents", maxCount: 10 }
        ]),
        ForMigrantWorkerController.updateForMigrantWorker
    )
//   .delete(deleteACategoryInfo);

export const BMETRegistrationRoutes = router;