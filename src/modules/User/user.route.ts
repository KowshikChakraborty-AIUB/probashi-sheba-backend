import express from 'express';
import { UserControllers } from './user.controller';
import { FileUploadHelper } from '../../helpers/FileUploadHelper';


const router = express.Router();

router.post('/send-otp', UserControllers.sendOtp);
router.route('/')
    .post(FileUploadHelper.ImageUpload.fields([
        { name: "user_profile", maxCount: 1 },
    ]), UserControllers.registerUser)

router.route('/verify-otp')
    .post(UserControllers.verifyOtp)

router.route('/login')
    .post(UserControllers.login)

export const UserRoutes = router;