import express from "express";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import { ChecklistController } from "./checklist.controller";

const router = express.Router();

// Create, Update, Get Testimonial
router
    .route("/")
    .get(ChecklistController.getChecklist)
    .post(ChecklistController.postChecklist)
    .patch(ChecklistController.updateChecklist)
    .delete(ChecklistController.deleteChecklist);

export const ChecklistRoutes = router;