import express from "express";
import { getNearestPassportOffice, postNearestPassportOffice } from "./nearestPassportOffice.controller";

const router = express.Router();

// Create, Update, Get Nearest Passport Office Info
router
    .route("/")
    .get(getNearestPassportOffice)
    .post(postNearestPassportOffice)
    // .patch()
//   .delete(deleteACategoryInfo);

export const nearestPassportOfficeRoutes = router;