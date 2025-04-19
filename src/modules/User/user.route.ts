import express from 'express';
import { UserControllers } from './user.controller';
import { FileUploadHelper } from '../../helpers/FileUploadHelper';
import { auth } from '../../middlewares/auth';


const router = express.Router();

router.post('/send-otp-phone', UserControllers.sendPhoneOtp);
router.post('/send-otp-email', UserControllers.sendEmailOtp);
router.route('/register')
    .post(FileUploadHelper.ImageUpload.fields([
        { name: "user_profile", maxCount: 1 },
    ]), UserControllers.registerUser)

router.post('/verify-otp-phone', UserControllers.verifyPhoneOtp)
router.post('/verify-otp-email', UserControllers.verifyEmailOtp)

router.post('/login', UserControllers.login)
router.patch('/profile', FileUploadHelper.ImageUpload.fields([
    { name: "user_profile", maxCount: 1 },
]), UserControllers.updateUser)
// router.post('/social-login', UserControllers.socialLogin)

router.post('/forgot-password', UserControllers.forgotPassword);
router.post('/reset-password', UserControllers.resetPassword);

router.post('/change-password',
    auth('user'),
    UserControllers.changePassword);

export const UserRoutes = router;