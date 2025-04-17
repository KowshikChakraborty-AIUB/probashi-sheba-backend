import express from "express";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import { ForMigrantWorkerController } from "./ForMigrantWorker.controller";

const router = express.Router();

// Create, Update, Get ForMigrantWorker
router
    .route("/")
    .get(ForMigrantWorkerController.getForMigrantWorker)
    .post(
        FileUploadHelper.ImageUpload.fields([
            { name: "for_migrant_workers_tab_image", maxCount: 1 },
            { name: "for_migrant_workers_tab_icon", maxCount: 1 }
        ]),
        ForMigrantWorkerController.postForMigrantWorker
    )
    .patch(
        FileUploadHelper.ImageUpload.fields([
            { name: "for_migrant_workers_tab_image", maxCount: 1 },
            { name: "for_migrant_workers_tab_icon", maxCount: 1 }
        ]),
        ForMigrantWorkerController.updateForMigrantWorker
    )
    .delete(ForMigrantWorkerController.deleteForMigrantWorker);

export const ForMigrantWorkerRoutes = router;