import express from 'express';
import { UserControllers } from './user.controller';
import { FileUploadHelper } from '../../helpers/FileUploadHelper';


const router = express.Router();

router.post('/send-otp-phone', UserControllers.sendPhoneOtp);
router.post('/send-otp-email', UserControllers.sendEmailOtp);
router.route('/register')
    .post(FileUploadHelper.ImageUpload.fields([
        { name: "user_profile", maxCount: 1 },
    ]), UserControllers.registerUser)

router.route('/verify-otp-phone')
    .post(UserControllers.verifyPhoneOtp)

router.route('/login')
    .post(UserControllers.login)

export const UserRoutes = router;