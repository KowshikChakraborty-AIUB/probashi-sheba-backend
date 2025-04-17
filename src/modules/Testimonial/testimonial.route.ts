import express from "express";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import { TestimonialController } from "./testimonial.controller";


const router = express.Router();

// Create, Update, Get Testimonial
router
    .route("/")
    .get(TestimonialController.getTestimonial)
    .post(
        FileUploadHelper.ImageUpload.fields([
            { name: "testimonial_image", maxCount: 1 },
        ]),
        TestimonialController.postTestimonial
    )
    .patch(
        FileUploadHelper.ImageUpload.fields([
            { name: "testimonial_image", maxCount: 1 },
        ]),
        TestimonialController.updateTestimonial
    )
    .delete(TestimonialController.deleteTestimonial);

export const TestimonialRoutes = router;