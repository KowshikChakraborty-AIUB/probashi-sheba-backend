import express from "express";
import { deleteNearestPassportOffice, getNearestPassportOffice, postNearestPassportOffice, updateNearestPassportOffice } from "./nearestPassportOffice.controller";

const router = express.Router();

// Create, Get, Update, Delete Nearest Passport Office Info
router
    .route("/")
    .get(getNearestPassportOffice)
    .post(postNearestPassportOffice)
    .patch(updateNearestPassportOffice)
    .delete(deleteNearestPassportOffice);

export const nearestPassportOfficeRoutes = router;