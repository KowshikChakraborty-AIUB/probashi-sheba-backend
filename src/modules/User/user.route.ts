import express from 'express';
import { UserControllers } from './user.controller';
import { FileUploadHelper } from '../../helpers/FileUploadHelper';


const router = express.Router();

router.route('/')
    .post(FileUploadHelper.ImageUpload.fields([
        { name: "user_profile", maxCount: 1 },
    ]), UserControllers.registerUser)

router.route('/verify-otp')
    .post(UserControllers.verifyOtp)

export const UserRoutes = router;