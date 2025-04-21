import express from "express";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import { WhoWeAreController } from "./whoWeAre.controller";

const router = express.Router();

// Create, Update, Get ForMigrantWorker
router
    .route("/")
    .get(WhoWeAreController.getWhoWeAre)
    .post(
        // FileUploadHelper.ImageUpload.fields([
        //     { name: "who_we_are_image", maxCount: 1 },
        //     { name: "who_we_are_item_image", maxCount: 1 },
        // ]),
        FileUploadHelper.ImageUpload.fields([
            { name: "who_we_are_image", maxCount: 1 },
            { name: "who_we_are_services_image", maxCount: 1 },
            { name: "who_we_are_migrants_image", maxCount: 1 },
            { name: "who_we_are_saved_image", maxCount: 1 },
            { name: "who_we_are_days_image", maxCount: 1 },
            { name: "who_we_are_employees_image", maxCount: 1 },
            { name: "who_we_are_additional_images", maxCount: 5 },
        ]),
        WhoWeAreController.postWhoWeAre
    )
    .patch(
        FileUploadHelper.ImageUpload.fields([
            { name: "who_we_are_image", maxCount: 1 },
            { name: "who_we_are_services_image", maxCount: 1 },
            { name: "who_we_are_migrants_image", maxCount: 1 },
            { name: "who_we_are_saved_image", maxCount: 1 },
            { name: "who_we_are_days_image", maxCount: 1 },
            { name: "who_we_are_employees_image", maxCount: 1 },
            { name: "who_we_are_additional_images", maxCount: 5 },
        ]),
        WhoWeAreController.updateWhoWeAre
    )
// .delete(ForMigrantWorkerController.deleteForMigrantWorker);

export const WhoWeAreRoutes = router;