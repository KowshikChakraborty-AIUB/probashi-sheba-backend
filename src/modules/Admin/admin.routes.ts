import express from "express";
import { AdminControllers } from "./admin.controller";
import { auth } from "../../Middlewares/auth";

const router = express.Router();

// Create, Get update and delete Admin side user
router
    .route("/")
    //   .get(AdminControllers.getAllAdmins)
    .post(AdminControllers.registerAdmin)
    //   .patch(FileUploadHelper.ImageUpload.fields([
    //         { name: "admin_profile", maxCount: 1 },
    //       ]), AdminControllers.updateAdmin)
    .delete(AdminControllers.deleteAdmin);

// login a Admin
router.route("/login").post(AdminControllers.loginAdmin)//.patch(updateAdmin);

//get logged in admin info by _id
router.route("/loggedAdmin/:_id").get(AdminControllers.getAdminById)

//change password
router.route("/changePassword").patch(auth(), AdminControllers.changeAdminPassword)

// get all dashboard admin
//router.route("/dashboard").get(findAllDashboardAdminRoleAdmin);

export const AdminRegRoutes = router;